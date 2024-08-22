import { fetchMessages, MessageFilter, MessageStatus } from '@/utils/xcall-fetcher';

export async function GET(req: Request): Promise<Response> {

  const url = new URL(req.url);

  const filter: MessageFilter = {
    src_network: url.searchParams.get('src_network') || '',
    dest_network: url.searchParams.get('dest_network') || '',
    status: url.searchParams.get('status') as MessageStatus,
    limit: parseInt(url.searchParams.get('limit') || '10', 10),
    skip: parseInt(url.searchParams.get('skip') || '0', 0),
  };
  try {
    const data = await fetchMessages(filter);
    return Response.json(data);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}