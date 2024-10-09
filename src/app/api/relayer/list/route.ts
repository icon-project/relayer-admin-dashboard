import { getAvailableRelayers } from "@/utils/relayer"

export async function GET(req: Request): Promise<Response> {
  try {
    const relayers = await getAvailableRelayers()
    return Response.json(relayers)
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}