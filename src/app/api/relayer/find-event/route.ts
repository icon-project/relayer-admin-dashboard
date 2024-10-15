import { getEventMissedRelayer, getRelayerInfoById } from "@/utils/relayer";

export async function POST(req: Request): Promise<Response> {
  try {
    const { txHash } = await req.json();;
    const data = await getEventMissedRelayer(txHash);
    if (!data || !data.relayerId) {
      return Response.json({ error: 'No relayer found' }, { status: 404 });
    }
    const relayInfo = await getRelayerInfoById(data.relayerId);
    console.log('Relayer info:', relayInfo);
    console.log('Data:', data);
    return Response.json({ id: relayInfo.id, name: relayInfo.name, data });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}