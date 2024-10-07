import fs from 'fs/promises';
import { cookies } from 'next/headers';
import path from 'path';
import serverFetch from './server-fetch';


const tokenCache: { [relayerId: string]: CachedToken } = {};

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

async function getRelayerById(id: string): Promise<RelayerConfig> {
  const relayers = await loadRelayer()
  const relayer = relayers.find((r: RelayerConfig) => r.id === id)
  console.log(relayers, id, relayer)
  if (!relayer) {
    throw new Error('Relayer not found')
  }
  return relayer
}

async function getCachedRelayerToken(relayerId: string): Promise<CachedToken> {
  const cachedToken = tokenCache[relayerId];
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken;
  }
  const relayerToken = await getRelayerToken(relayerId);
  const expiresIn = 60 * 60 * 1000;
  const newCachedToken: CachedToken = {
    token: relayerToken.token,
    host: relayerToken.host,
    expiresAt: now + expiresIn,
  };
  tokenCache[relayerId] = newCachedToken;
  return newCachedToken;
}

async function getRelayerToken(id: string): Promise<RelayerToken> {
  try {
    const relayer = await getRelayerById(id)
    const postBody = {
      email: relayer.auth.email,
      password: relayer.auth.password,
      csrfToken: await getCsrfToken(id),
    }
    const { credentials } = await getProviders(id)
    const response = await serverFetch(credentials.callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
    const data = response.headers.get('Set-Cookie')
    if (!data) {
      throw new Error('Failed to get relayer token')
    }
    const tokenMatch = data.match(/token=([^;]+);/)
    if (!tokenMatch) {
      throw new Error('Failed to get relayer token')
    }
    const token = tokenMatch[1]
    return {
      id,
      token: token,
      host: relayer.host,
    }
  } catch (error: any) {
    console.error(error)
    throw new Error('Failed to get relayer token')
  }
}

export async function getCsrfToken(relayerId: string): Promise<string> {
  try {
    const relayer = await getRelayerById(relayerId)
    const response = await serverFetch(`${relayer.host}/api/auth/csrf`)
    const data = await response.json()
    return data.csrfToken
  } catch (error) {
    throw new Error('Failed to get csrf token')
  }
}

interface ProviderResponse {
  credentials: {
    callbackUrl: string;
  };
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
      headers: {
        'Authorization': `Bearer ${relayer.token}`,
        'Content-Type': 'application/json',
      },
      body: request?.body,
    })
    return response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to proxy request to relayer')
  }
}

export async function getAvailableRelayers(): Promise<{ id: string, name: string }[]> {
  const relayers = await loadRelayer()
  return relayers.map((r: RelayerConfig) => ({ id: r.id, name: r.name }))
}

export function getCurrentRelayer(): string {
  return cookies().get('relayerId')?.value ?? ''
}