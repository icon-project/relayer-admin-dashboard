import { getDictionary } from '@/locales/dictionary'
import { readUsers } from '@/utils/user'
import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { ...token, user: { ...user as User }, }
      }

      return token
    },
    async session({ session, token }) {
      return { ...session, user: token.user }
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'string' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }
        const { email, password } = credentials
        const data = await authenticate(email, password)
        return data;
      },
    }),
  ],
}

export async function authenticate(email: string, password: string): Promise<User> {
  const users = await readUsers()
  const user = users.find((u: User) => u.email === email && u.password === password)
  const dict = await getDictionary()
  if (!user) {
    throw new Error(dict.login.message.auth_failed)
  }
  return { ...user }
}