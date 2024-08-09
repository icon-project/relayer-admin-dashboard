import { socketManager } from '@/utils/socket-fetch';
import { NextApiRequest } from 'next';

export async function POST(req: NextApiRequest) {

  const chain = req.body.chain;

  const data = await socketManager.relayMessage(req.body);
  return Response.json(data);
}