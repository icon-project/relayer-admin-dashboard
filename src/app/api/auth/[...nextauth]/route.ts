import { authOptions } from '@/app/api/auth/option';
import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    name: string;
    email: string;
    password: string | null;
    avatar: string;
    company: string;
    designation: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
