import { fetchMessages, MessageFilter, MessageStatus } from '@/utils/xcall-fetcher';


const getTimestamp = (dateTime: string): string => {
  if (!dateTime || dateTime === '0') {
    return '';
  }
  const ms = parseInt(dateTime, 10) / 1000;
  return `${ms}`;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);

  const filter: MessageFilter = {
    src_network: url.searchParams.get('src_network') || '',
    dest_network: url.searchParams.get('dest_network') || '',
    status: url.searchParams.get('status') as MessageStatus,
    limit: parseInt(url.searchParams.get('limit') || '10', 10),
    skip: parseInt(url.searchParams.get('skip') || '0', 0),
    from_timestamp: getTimestamp(url.searchParams.get('from_timestamp') || ''),
    to_timestamp: getTimestamp(url.searchParams.get('to_timestamp') || ''),
  };

  try {
    const data = await fetchMessages(filter);
    return Response.json(data);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}