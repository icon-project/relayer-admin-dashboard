import { fetchMessages, MessageFilter } from '@/utils/xcall-fetcher';

export async function GET(req: Request) {

  const url = new URL(req.url);

  const filter: MessageFilter = {
    chain: url.searchParams.get('chain') || '',
    status: url.searchParams.get('status') || '',
    limit: parseInt(url.searchParams.get('limit') || '10', 10),
  };
  const data = await fetchMessages(filter);
  return Response.json(data);
}