import { fetchTotalMessages, MessageFilter, MessageStatus } from '@/utils/xcall-fetcher';

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const filter: MessageFilter = {
    status: url.searchParams.get('status') as MessageStatus || MessageStatus.PENDING,
    src_network: url.searchParams.get('src_network') as string,
    dest_network: url.searchParams.get('dest_network') as string,
  };
  const data = await fetchTotalMessages(filter);
  return Response.json(data);
}
