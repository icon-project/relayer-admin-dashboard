import { getAvailableRelayers } from "@/utils/relayer"

export async function GET(req: Request) {
  try {
    const relayers = await getAvailableRelayers()
    return new Response(JSON.stringify(relayers))
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}