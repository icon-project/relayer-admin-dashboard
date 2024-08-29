

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, password } = await req.json()

    if (!email && !password) {
      return Response.json({error: 'No auth details provided!'}, {status: 400})
    }

}