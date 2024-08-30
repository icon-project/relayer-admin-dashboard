export async function POST(req: Request): Promise<Response> {
  try {
    const { email, password } = await req.json()
    if (!email && !password) {
      return Response.json({error: 'no auth details provided!'}, { status: 400 })
    }

  } catch(e) {
    return Response.json({error: 'something went wrong.' }, { status: 500 })
  }
}