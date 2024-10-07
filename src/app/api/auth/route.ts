import { authenticate, sign } from '@/app/api/auth/option';
import { getCsrfToken } from 'next-auth/react';

export async function POST(req: Request): Promise<Response> {
  try {
    const csrfToken = req.headers.get('csrf-token');
    const sessionCsrfToken = await getCsrfToken({ req: { headers: Object.fromEntries(req.headers.entries()) } });

    if (!csrfToken || csrfToken !== sessionCsrfToken) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'No auth details provided!' }), { status: 400 });
    }

    const user = await authenticate(email, password);
    if (user) {
      const secret = process.env.NEXTAUTH_SECRET ?? 'default_secret';
      const token = await sign(user, secret);
      return new Response(JSON.stringify({ token }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Failed to login' }), { status: 401 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500 });
  }
}