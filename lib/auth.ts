import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        sifre: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.sifre) return null

        const kullanici = await prisma.kullanici.findUnique({
          where: { email: credentials.email as string },
        })

        if (!kullanici) return null

        const sifreDoğru = await bcrypt.compare(
          credentials.sifre as string,
          kullanici.sifreHash
        )

        if (!sifreDoğru) return null

        return {
          id: kullanici.id,
          email: kullanici.email,
          name: `${kullanici.ad} ${kullanici.soyad}`,
          image: kullanici.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/giris',
    error: '/giris',
  },
  session: {
    strategy: 'jwt',
  },
})
