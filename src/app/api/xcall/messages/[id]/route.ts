import { fetchMessageById, MessageByIdResponse } from '@/utils/xcall-fetcher';

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split('/')[4];
  try {
    const message: MessageByIdResponse = await fetchMessageById(parseInt(id, 10));
    return Response.json(message);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}