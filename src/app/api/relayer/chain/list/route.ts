import { socketManager } from '@/utils/socket-fetch';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
  const data = await socketManager.listChains();
  return Response.json(data);
}