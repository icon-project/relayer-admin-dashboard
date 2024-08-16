import fs from 'fs/promises';
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
  path: string;
  method: string;
  body?: any;
}

export async function loadRelayer(): Promise<RelayerConfig[]> {
  const relayersPath = process.env.NEXT_RELAYERS_MAP_FILE || path.join(process.cwd(), 'relayers.json')
  const relayersJson = await fs.readFile(relayersPath, 'utf8')
  const relayers: RelayerConfig[] = JSON.parse(relayersJson)
  return relayers
}

async function getRelayerById(id: string): Promise<RelayerConfig> {
  const relayers = await loadRelayer()
  const relayer = relayers.find((r: RelayerConfig) => r.id === id)
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
  const relayer = await getRelayerById(id)
  const postBody = {
    email: relayer.auth.email,
    password: relayer.auth.password,
  }
  const response = await serverFetch(`${relayer.host}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  })
  const data = await response.json()
  return {
    id,
    token: data.token,
    host: relayer.host,
  }
}

export async function Proxy(request: ProxyRequest) {
  const relayerToken = await getCachedRelayerToken(request.relayerId)
  const response = await serverFetch(`${relayerToken.host}/${request.path}`, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${relayerToken.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request.body),
  })
  return response.json()
}