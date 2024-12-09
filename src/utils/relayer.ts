import fs from 'fs/promises'
import { cookies } from 'next/headers'
import path from 'path'
import serverFetch from './server-fetch'
import { BlockEvents, socketManager } from './socket-fetch'

const relayersPath = process.env.NEXT_RELAYERS_MAP_FILE_PATH || path.join(process.cwd(), 'relayers.json')

const tokenCache: { [relayerId: string]: CachedToken } = {}

export interface RelayerInfo {
    id: string
    name: string
}

export interface RelayerConfig {
    id: string
    name: string
    host: string
    auth: {
        email: string
        password: string
    }
}

interface CachedToken {
    token: string
    csrfToken: string
    host: string
    expiresAt: number
}

interface RelayerToken {
    id: string
    token: string
    host: string
    csrfToken: string
}

export interface ProxyRequest {
    relayerId: string
    method: string
    args?: Record<string, string>
    body?: any
}

interface ProviderResponse {
    credentials: {
        callbackUrl: string
    }
}

export async function readRelayers(): Promise<RelayerConfig[]> {
    try {
        const relayersJson = await fs.readFile(relayersPath, 'utf8')
        const relayers: RelayerConfig[] = JSON.parse(relayersJson)
        return relayers
    } catch (error) {
        throw new Error('Failed to read relayers')
    }
}

export async function addRelayer(relayer: RelayerConfig): Promise<RelayerConfig> {
    try {
        const relayers = await readRelayers()
        relayers.push(relayer)
        await fs.writeFile(relayersPath, JSON.stringify(relayers, null, 2), 'utf8')
        return relayer
    } catch (error) {
        throw new Error(`Failed to add relayer ${error}`)
    }
}

export async function updateRelayer(relayer: RelayerConfig): Promise<RelayerConfig> {
    try {
        const relayers = await readRelayers()
        const index = relayers.findIndex((r: RelayerConfig) => r.id === relayer.id)
        if (index === -1) {
            throw new Error('Relayer not found')
        }
        relayers[index] = relayer
        await fs.writeFile(relayersPath, JSON.stringify(relayers, null, 2), 'utf8')
        return relayer
    } catch (error) {
        throw new Error('Failed to update relayer')
    }
}

export async function deleteRelayer(id: string): Promise<void> {
    try {
        const relayers = await readRelayers()
        const filteredRelayers = relayers.filter((r: RelayerConfig) => r.id !== id)
        await fs.writeFile(relayersPath, JSON.stringify(filteredRelayers, null, 2), 'utf8')
    } catch (error) {
        throw new Error('Failed to delete relayer')
    }
}

export async function getRelayerById(id: string): Promise<RelayerConfig> {
    const relayers = await readRelayers()
    const relayer = relayers.find((r: RelayerConfig) => r.id === id)
    if (!relayer) {
        throw new Error('Relayer not found')
    }
    return relayer
}

export async function getRelayerInfoById(id: string): Promise<RelayerInfo> {
    const { id: relayerId, name } = await getRelayerById(id)
    return { id: relayerId, name }
}

async function getCachedRelayerToken(relayerId: string): Promise<CachedToken> {
    const cachedToken = tokenCache[relayerId]
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken
    }
    const relayerToken = await getRelayerToken(relayerId)
    const expiresIn = Date.now() + 2 * 60 * 60 * 1000
    const newCachedToken: CachedToken = {
        token: relayerToken.token,
        csrfToken: relayerToken.csrfToken,
        host: relayerToken.host,
        expiresAt: expiresIn,
    }
    tokenCache[relayerId] = newCachedToken
    return tokenCache[relayerId]
}

async function getRelayerToken(id: string): Promise<RelayerToken> {
    try {
        const relayer = await getRelayerById(id)
        const { credentials } = await getProviders(id)
        const { token, cookie, isSecure } = await getCsrfToken(id)
        const postBody = {
            email: relayer.auth.email,
            password: relayer.auth.password,
            csrfToken: token,
        }
        const csrfCookie = `next-auth.csrf-token=${cookie};`
        const cookies = isSecure ? `__Host-${csrfCookie}` : csrfCookie
        const response = await fetch(credentials.callbackUrl, {
            method: 'POST',
            credentials: 'include',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookies,
            },
            body: JSON.stringify(postBody),
        })
        const headers = response.headers.get('Set-Cookie')
        if (!headers) {
            throw new Error(`failed to get relayer token for ${relayer.id} ${response.status}`)
        }
        const tokenMatch = headers.match(/next-auth.session-token=([^;]+);/)
        if (!tokenMatch) {
            throw new Error('failed to find relayer token')
        }
        const jwtToken = tokenMatch[1]
        return {
            id,
            token: jwtToken,
            host: relayer.host,
            csrfToken: cookies,
        }
    } catch (error: any) {
        throw new Error(`failed to get relayer token for ${id} ${error}`)
    }
}

interface CSRFResponse {
    token: string
    cookie: string
    isSecure: boolean
}

export async function getCsrfToken(relayerId: string): Promise<CSRFResponse> {
    try {
        const relayer = await getRelayerById(relayerId)
        const response = await serverFetch(`${relayer.host}/api/auth/csrf`, {
            method: 'GET',
            credentials: 'include',
        })
        const { csrfToken } = await response.json()
        const cookies = response.headers.get('Set-Cookie')
        if (!csrfToken || !cookies) {
            throw new Error('failed to get csrf token')
        }
        const csrfTokenMatch = cookies.match(/next-auth.csrf-token=([^;]+);/)
        if (!csrfTokenMatch) {
            throw new Error('failed to find csrf token')
        }
        const isSecure = cookies?.includes('__Secure-')
        return { token: csrfToken, cookie: csrfTokenMatch[1], isSecure }
    } catch (error) {
        throw new Error(`failed to get csrf token for relayer ${relayerId} ${error}`)
    }
}

export async function getProviders(relayerId: string): Promise<ProviderResponse> {
    try {
        const relayer = await getRelayerById(relayerId)
        const response = await serverFetch(`${relayer.host}/api/auth/providers`)
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error('Failed to get providers')
    }
}

export async function Proxy(request: ProxyRequest) {
    try {
        const relayer = await getCachedRelayerToken(request.relayerId)
        const url = `${relayer.host}/api/event?${new URLSearchParams(request.args).toString()}`
        const response = await serverFetch(url, {
            method: request.method,
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${relayer.token}`,
                'Content-Type': 'application/json',
                Cookies: relayer.csrfToken,
            },
            body: request.method === 'POST' ? JSON.stringify(request.body) : undefined,
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
        throw new Error(`failed to proxy request to relayer ${request.relayerId}`)
    }
}

export async function getAvailableRelayers(): Promise<RelayerInfo[]> {
    const relayers = await readRelayers()
    return relayers.map((r: RelayerConfig) => ({ id: r.id, name: r.name }))
}

export async function getCurrentRelayer(): Promise<string> {
    const cookieStore = await cookies()
    return cookieStore.get('relayerId')?.value ?? ''
}

export interface MissedRelayer {
    relayerId: string
    name: string
    txHash: string
    data: BlockEvents
    executed: boolean
}

export async function getEventMissedRelayer(txHash: string): Promise<MissedRelayer[] | null> {
    const relayers = await getAvailableRelayers()

    const socketTask = async (): Promise<MissedRelayer[] | null> => {
        try {
            const events: BlockEvents[] = await socketManager.getBlockEvents(txHash)
            if (!events || events.length === 0) {
                return null
            }
            const ownEvents: MissedRelayer[] = []
            for (const event of events) {
                const ownEvent = {
                    relayerId: 'self',
                    name: 'Self',
                    txHash: txHash,
                    data: event,
                    executed: event.executed,
                }
                ownEvents.push(ownEvent)
            }
            return ownEvents
        } catch (error) {
            console.error('Error fetching block events from socket:', error)
            return null
        }
    }

    const tasks = relayers.map(async (relayer): Promise<MissedRelayer[] | null> => {
        try {
            const proxyRequest: ProxyRequest = {
                relayerId: relayer.id,
                method: 'POST',
                body: { txHash },
                args: { event: 'GetBlockEvents' },
            }
            const events: BlockEvents[] = await Proxy(proxyRequest)
            if (!events || events.length === 0) {
                return null
            }
            const remoteEvents: MissedRelayer[] = []
            for (const event of events) {
                const remoteRelayerEvent = {
                    relayerId: relayer.id,
                    name: relayer.name,
                    txHash: event.txHash,
                    data: event,
                    executed: event.executed,
                }
                remoteEvents.push(remoteRelayerEvent)
            }
            return remoteEvents
        } catch (error) {
            console.error(`Error fetching block events from relayer ${relayer.id}:`, error)
            return null
        }
    })

    const results = await Promise.allSettled([...tasks, socketTask()])

    const successfulResults = results
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<MissedRelayer[]>).value)
    return successfulResults.flat()
}
