// dataFetcher.ts

import serverFetch from './server-fetch';

const BASE_URL = process.env.XCALL_BASE_URL;

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
  pagination: {
    total: number;
    size: number;
    number: number;
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

enum MessageStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  ROLLBACK = 'rollback',
}

interface MessageFilter {
  status?: MessageStatus;
  src_network?: string;
  dest_network?: string;
  limit?: number;
}

export async function fetchMessages(filter: MessageFilter): Promise<MessagesResponse> {
  const { status, src_network, dest_network, limit = 10 } = filter;
  const url = `${BASE_URL}/messages?status=${status}&src_network=${src_network}&dest_network=${dest_network}&limit=${limit}`;
  const response = await serverFetch(url);
  return response.json();
}

export async function fetchMessageById(id: number): Promise<MessageByIdResponse> {
  const url = `${BASE_URL}/messages/${id}`;
  const response = await serverFetch(url);
  return response.json();
}

export async function fetchTotalMessages(filter: MessageFilter): Promise<TotalMessagesResponse> {
  const { status, src_network, dest_network } = filter;
  const url = `${BASE_URL}/statistics/total_messages?status=${status}&src_network=${src_network}&dest_network=${dest_network}`;
  const response = await serverFetch(url);
  return response.json();
}