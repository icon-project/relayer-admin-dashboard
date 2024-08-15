import { fetchStatistics, MessageFilter, MessageStatus } from '@/utils/xcall-fetcher';
import type { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest): Promise<Response> {
  const url = new URL(req.url);
  const filter: MessageFilter = {
    status: url.searchParams.get('status') as MessageStatus || MessageStatus.EXECUTED,
  };
  const data = await fetchStatistics(filter);
  return Response.json(data);
}