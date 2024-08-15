import fs from 'fs/promises';
import path from 'path';
import serverFetch from './server-fetch';

interface RelayerConfig {
  id: string;
  name: string;
  host: string;
  auth: {
    email: string;
    password: string;
  };
}

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

async function loadRelayer(): Promise<RelayerConfig[]> {
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
  const relayerToken = await getRelayerToken(request.relayerId)
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