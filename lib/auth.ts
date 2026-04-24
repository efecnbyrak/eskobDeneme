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
        rememberMe: { label: 'Beni Hatırla', type: 'text' },
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

          const rememberMe = credentials?.rememberMe === 'true'

          return {
            id: String(kullanici.id),
            email: kullanici.email,
            name: `${kullanici.ad} ${kullanici.soyad}`,
            image: kullanici.avatarUrl ?? null,
            rol: kullanici.rol,
            ad: kullanici.ad,
            soyad: kullanici.soyad,
            kullaniciAdi: kullanici.kullaniciAdi ?? null,
            rememberMe,
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
        const u = user as { id: string; rol: Rol; ad: string; soyad: string; kullaniciAdi?: string | null; rememberMe?: boolean }
        token.id = u.id
        token.rol = u.rol
        token.ad = u.ad
        token.soyad = u.soyad
        token.kullaniciAdi = u.kullaniciAdi ?? null
        token.rememberMe = u.rememberMe ?? true
        if (u.rememberMe === false) {
          // 24 saat sonra süresi dolar
          token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }
      }
      if (trigger === 'update' && token.id) {
        const taze = await prisma.kullanici.findUnique({
          where: { id: parseInt(token.id as string) },
          select: { rol: true, ad: true, soyad: true, kullaniciAdi: true, avatarUrl: true, email: true },
        })
        if (taze) {
          token.rol = taze.rol
          token.ad = taze.ad
          token.soyad = taze.soyad
          token.kullaniciAdi = taze.kullaniciAdi ?? null
          token.picture = taze.avatarUrl ?? undefined
          token.email = taze.email
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.rol = token.rol as Rol
        session.user.ad = token.ad as string
        session.user.soyad = token.soyad as string
        session.user.kullaniciAdi = (token.kullaniciAdi as string | null) ?? null
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
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  secret: process.env.AUTH_SECRET,
})

export function girisYoluByRol(rol?: Rol | string | null): string {
  switch (rol) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/phyberk/admin'
    case 'BUSINESS':
      return '/isletme/panel'
    case 'USER':
    default:
      return '/hesabim'
  }
}
