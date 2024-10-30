import 'server-only';

import serverFetch from './server-fetch';

const BASE_URL = process.env.NEXT_XCALLSCAN_BASE_URL || 'https://xcallscan.com/api';

interface Message {
  id: number;
  sn: string;
  status: string;
  src_network: string;
  src_block_number: string;
  src_block_timestamp: string;
  src_tx_hash: string;
  src_address: string;
  src_error: string | null;
  dest_network: string;
  dest_block_number: string | null;
  dest_block_timestamp: string | null;
  dest_tx_hash: string | null;
  dest_address: string;
  dest_error: string | null;
  response_block_number: string | null;
  response_block_timestamp: string | null;
  response_tx_hash: string | null;
  response_error: string | null;
  rollback_block_number: string | null;
  rollback_block_timestamp: string | null;
  rollback_tx_hash: string | null;
  rollback_error: string | null;
  created_at: string;
}

interface MessagesResponse {
  data: Message[];
  meta: {
    pagination: {
      total: number;
      size: number;
      number: number;
    };
    urls: {
      tx: Record<string, string>;
    };
  };
  time: number;
}

interface MessageByIdResponse {
  data: Message[];
  meta: {
    urls: {
      tx: Record<string, string>;
    };
  };
}

interface TotalMessagesResponse {
  data: {
    total: number;
  };
}

interface StatisticResponse {
  data: {
    messages: number;
    fees: {
      icon: string;
      bsc: string;
      eth2: string;
      havah: string;
      ibc_archway: string;
      ibc_neutron: string;
      ibc_injective: string;
      avax: string;
      base: string;
      arbitrum: string;
      optimism: string;
      sui: string;
      polygon: string;
    };
  };
  meta: {
    urls: {
      tx: {
        bsc: string;
        icon: string;
        eth2: string;
        havah: string;
        ibc_archway: string;
        ibc_neutron: string;
        ibc_injective: string;
        avax: string;
        base: string;
        arbitrum: string;
        optimism: string;
        sui: string;
        polygon: string;
      };
    };
  };
}

export enum MessageStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  EXECUTED = 'executed',
  ROLLBACK = 'rollback',
}

interface MessageFilter {
  status?: MessageStatus;
  src_network?: string;
  dest_network?: string;
  skip?: number;
  limit?: number;
  from_timestamp?: number | null;
  to_timestamp?: number | null;
}

export async function fetchMessages(filter: MessageFilter): Promise<MessagesResponse> {
  try {
    const { status, src_network, dest_network, limit = 10, skip = 0, from_timestamp, to_timestamp } = filter;
    const url = new URL(`${BASE_URL}/messages`);
    url.searchParams.append('status', status || '');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('skip', skip.toString());
    if (src_network) url.searchParams.append('src_network', src_network);
    if (dest_network) url.searchParams.append('dest_network', dest_network);
    if (from_timestamp) url.searchParams.append('from_timestamp', from_timestamp.toString());
    if (to_timestamp) url.searchParams.append('to_timestamp', to_timestamp.toString());
    console.log(url.toString());
    const response = await serverFetch(url.toString());
    return response.json();
  } catch (error: any) {
    throw new Error(`failed to fetch messages: ${error.message}`);
  }
}

export async function fetchMessageById(id: number): Promise<MessageByIdResponse> {
  const url = `${BASE_URL}/messages/${id}`;
  const response = await serverFetch(url);
  return response.json();
}

export async function fetchStatistics(filter: MessageFilter): Promise<StatisticResponse> {
  const { status, src_network, dest_network } = filter;
  const url = `${BASE_URL}/statistics?status=${status}`;
  const response = await serverFetch(url);
  return response.json();
}

export async function fetchTotalMessages(filter: MessageFilter): Promise<TotalMessagesResponse> {
  const { status, src_network, dest_network } = filter;
  const url = `${BASE_URL}/statistics/total_messages?status=${status}`;
  const response = await serverFetch(url);
  return response.json();
}

export type { Message, MessageByIdResponse, MessageFilter, MessagesResponse, StatisticResponse, TotalMessagesResponse };
