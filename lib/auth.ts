import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        sifre: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const email = (credentials?.email as string | undefined)?.toLowerCase().trim()
          const sifre = credentials?.sifre as string | undefined
          if (!email || !sifre) return null

          const kullanici = await prisma.kullanici.findUnique({ where: { email } })
          if (!kullanici) return null

          const dogru = await bcrypt.compare(sifre, kullanici.sifreHash)
          if (!dogru) return null

          return {
            id: String(kullanici.id),
            email: kullanici.email,
            name: `${kullanici.ad} ${kullanici.soyad}`,
            image: kullanici.avatarUrl,
            rol: kullanici.rol,
          }
        } catch (err) {
          console.error('authorize error:', err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = (user as { id: string }).id
        token.rol = (user as { rol: Rol }).rol
      }
      if (trigger === 'update' && token.id) {
        const taze = await prisma.kullanici.findUnique({ where: { id: parseInt(token.id as string) } })
        if (taze) token.rol = taze.rol
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const u = session.user as { id?: string; rol?: Rol }
        u.id = token.id as string
        u.rol = token.rol as Rol
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
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
})

export function girisYoluByRol(rol?: Rol | string | null): string {
  switch (rol) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/phyberk/admin'
    case 'BUSINESS':
      return '/panel'
    case 'USER':
    default:
      return '/user'
  }
}
