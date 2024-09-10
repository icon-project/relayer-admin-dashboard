import { authenticate, sign } from '@/app/api/auth/option';

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, password } = await req.json()
    if (!email && !password) {
      return Response.json({error: 'no auth details provided!'}, { status: 400 })
    }
    const user = await authenticate(email, password);
    if (user) {
      const secret = process.env.NEXTAUTH_SECRET;
      const token = await sign(user, secret);
      return Response.json({token});
    }
    return Response.json({error: 'failed to login'}, {status: 401 })
  } catch(e) {
    return Response.json({error: 'something went wrong.' }, { status: 401 })
  }
}