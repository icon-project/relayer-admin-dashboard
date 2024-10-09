import { getEventMissedRelayer, getRelayerInfoById } from "@/utils/relayer";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { txHash } = body;
    const data = await getEventMissedRelayer(txHash);
    if (!data || !data.relayerId) {
      return Response.json({ error: 'No relayer found' }, { status: 404 });
    }
    const relayInfo = await getRelayerInfoById(data.relayerId);
    return Response.json(relayInfo);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}