import { getDictionary } from '@/locales/dictionary'
import fs from 'fs/promises'
import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import path from 'path'

async function loadUsers(): Promise<User[]> {
  const usersPath = process.env.USERS_LIST_PATH || path.join(process.cwd(), 'users.json')
  const usersJson = await fs.readFile(usersPath, 'utf8')
  const users: User[] = JSON.parse(usersJson)
  return users
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { ...token, user: { ...user as User } }
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

        const users = await loadUsers()

        const user = users.find((u: User) => u.email === email && u.password === password)

        const dict = await getDictionary()

        if (!user) {
          throw new Error(dict.login.message.auth_failed)
        }
        return { ...user, password: '' }
      },
    }),
  ],
}
