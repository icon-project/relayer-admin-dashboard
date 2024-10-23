import fs from 'fs/promises';
import { cookies } from 'next/headers';
import path from 'path';
import serverFetch from './server-fetch';
import { BlockEvents, socketManager } from './socket-fetch';


const tokenCache: { [relayerId: string]: CachedToken } = {};

interface RelayerInfo {
  id: string;
  name: string;
}

interface RelayerConfig {
  id: string;
  name: string;
  host: string;
  auth: {
    email: string;
    password: string;
  };
}

type CachedToken = {
  token: string;
  host: string;
  expiresAt: number;
};

interface RelayerToken {
  id: string;
  token: string;
  host: string;
}

export interface ProxyRequest {
  relayerId: string;
  method: string;
  args?: Record<string, string>
  body?: any;
}

interface ProviderResponse {
  credentials: {
    callbackUrl: string;
  };
}

export async function loadRelayer(): Promise<RelayerConfig[]> {
  try {
    const relayersPath = process.env.NEXT_RELAYERS_MAP_FILE || path.join(process.cwd(), 'relayers.json')
    const relayersJson = await fs.readFile(relayersPath, 'utf8')
    const relayers: RelayerConfig[] = JSON.parse(relayersJson)
    return relayers
  } catch (error) {
    throw new Error('Failed to load relayers')
  }
}

export async function getRelayerById(id: string): Promise<RelayerConfig> {
  const relayers = await loadRelayer()
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
  console.log('Cached token:', tokenCache[relayerId])
  const relayerToken = await getRelayerToken(relayerId);
  const expiresIn = 60 * 60 * 1000;
  const newCachedToken: CachedToken = {
    token: relayerToken.token,
    host: relayerToken.host,
    expiresAt: expiresIn,
  };
  tokenCache[relayerId] = newCachedToken;
  return newCachedToken;
}

async function getRelayerToken(id: string): Promise<RelayerToken> {
  try {
    const relayer = await getRelayerById(id)
    const { credentials } = await getProviders(id)
    const { token, cookie } = await getCsrfToken(id)
    console.log('Relayer:', token, cookie)
    const postBody = {
      email: relayer.auth.email,
      password: relayer.auth.password,
      csrfToken: token,
    }
    console.log('Login body:', JSON.stringify(postBody))
    const response = await fetch(credentials.callbackUrl, {
      method: 'POST',
      credentials: 'include',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.csrf-token=${cookie}`,
      },
      body: JSON.stringify(postBody),
    })
    const headers = response.headers.get('Set-Cookie')
    if (!headers) {
      throw new Error('failed to get relayer token')
    }
    console.log('Login headers:', headers)
    const tokenMatch = headers.match(/session-token=([^;]+);/)
    if (!tokenMatch) {
      throw new Error('failed to find relayer token')
    }
    console.log('Relayer token:', tokenMatch[1])
    const jwtToken = tokenMatch[1]
    return {
      id,
      token: jwtToken,
      host: relayer.host,
    }
  } catch (error: any) {
    console.error(error)
    throw new Error('Failed to get relayer token')
  }
}

interface CSRFResponse {
  token: string;
  cookie: string;
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
    return { token: csrfToken, cookie: csrfTokenMatch[1] }
  } catch (error) {
    throw new Error('Failed to get csrf token')
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
        'Authorization': `Bearer ${relayer.token}`,
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

export async function getAvailableRelayers(): Promise<{ id: string, name: string }[]> {
  const relayers = await loadRelayer()
  return relayers.map((r: RelayerConfig) => ({ id: r.id, name: r.name }))
}

export function getCurrentRelayer(): string {
  return cookies().get('relayerId')?.value ?? ''
}

interface MissedRelayer {
  relayerId: string;
  name: string;
  txHash: string;
  data: BlockEvents;
}

export async function getEventMissedRelayer(txHash: string): Promise<MissedRelayer[] | null> {
  const relayers = await getAvailableRelayers();
  const socketTask = (async (): Promise<MissedRelayer | null> => {
    try {
      const events: BlockEvents[] = await socketManager.getBlockEvents(txHash);
      if (!events || events.length === 0) {
        return null;
      }
      for (const event of events) {
        return { relayerId: 'self', name: "Self", txHash: txHash, data: event };
      }
      return null;
    } catch (error) {
      console.error('Error fetching block events from socket:', error);
      return null;
    }
  })
  const tasks = relayers.map(async (relayer) => {
    try {
      const proxyRequest: ProxyRequest = {
        relayerId: relayer.id,
        method: 'POST',
        body: JSON.stringify({ txHash }),
        args: { event: 'GetBlockEvents' },
      };
      const response = await Proxy(proxyRequest);
      const events: BlockEvents[] = await response.json()
      if (!events || events.length === 0) {
        return null;
      }
      for (const event of events) {
        return { relayerId: relayer.id, name: relayer.name, txHash: event.txHash, data: event };
      }
    } catch (error) {
      console.error(`Error fetching block events from relayer ${relayer.id}:`, error);
      return null;
    }
  });
  const results = await Promise.all([...tasks, socketTask()]);
  const successfulResults = results.filter(result => result !== null);
  return successfulResults as MissedRelayer[];
}