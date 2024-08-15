import { socketManager } from '@/utils/socket-fetch';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url);
  const chain = url.searchParams.get('chain');
  const address = url.searchParams.get('address');
  if (!chain || !address) {
    return Response.json({ error: 'chain and address are required' }, { status: 400 });
  }
  const data = await socketManager.getChainBalance(chain, address);
  return Response.json(data);
}