import { fetchStatistics, MessageFilter, MessageStatus } from '@/utils/xcall-fetcher';

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const filter: MessageFilter = {
    status: url.searchParams.get('status') as MessageStatus || MessageStatus.EXECUTED,
  };
  try {
    const data = await fetchStatistics(filter);
    return Response.json(data);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}