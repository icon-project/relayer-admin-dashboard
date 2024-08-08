import { fetchStatistics } from '@/utils/xcall-fetcher';
import type { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
  const data = await fetchStatistics();
  return Response.json(data);
}