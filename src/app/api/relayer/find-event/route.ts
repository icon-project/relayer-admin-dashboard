import { getEventMissedRelayer } from "@/utils/relayer";

export async function POST(req: Request): Promise<Response> {
  try {
    const { txHash } = await req.json();;
    const data = await getEventMissedRelayer(txHash);
    if (!data || data.length === 0) {
      return Response.json({ error: 'No relayer found' }, { status: 404 });
    }
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}