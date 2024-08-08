import { fetchMessageById } from '@/utils/xcall-fetcher';
import type { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url);
  if (!url.searchParams.has('id')) {
    return Response.json({ error: 'id is required' }, { status: 400 });
  }
  const id = req.query.id;
  const message = await fetchMessageById(parseInt(id as string, 10));
  return Response.json(message);
}