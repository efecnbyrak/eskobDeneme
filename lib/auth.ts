import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { decode, encode } from '@auth/core/jwt'
import bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'
import { prisma } from './db'
import { logger } from './logger'

export type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

const isProd = process.env.NODE_ENV === 'production'

if (isProd && !process.env.AUTH_SECRET) {
  // Build/runtime'da hızlı fail — sessiz random secret üretmesin
  throw new Error('AUTH_SECRET env değişkeni production için zorunludur.')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Vercel preview / yerel dev için trustHost; prod'da AUTH_URL set'liyse devre dışı kalır
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
          if (kullanici.deletedAt) return null

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
          logger.error('auth.authorize', { err: String(err) })
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const u = user as {
          id: string
          rol: Rol
          ad: string
          soyad: string
          kullaniciAdi?: string | null
          rememberMe?: boolean
        }
        token.id = u.id
        token.rol = u.rol
        token.ad = u.ad
        token.soyad = u.soyad
        token.kullaniciAdi = u.kullaniciAdi ?? null
        token.rememberMe = u.rememberMe ?? true
        if (u.rememberMe === false) {
          token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }
      }

      if (trigger === 'update' && token.id) {
        const idNum = Number(token.id)
        if (!Number.isInteger(idNum)) return token
        try {
          const taze = await prisma.kullanici.findUnique({
            where: { id: idNum },
            select: {
              rol: true,
              ad: true,
              soyad: true,
              kullaniciAdi: true,
              avatarUrl: true,
              email: true,
              deletedAt: true,
            },
          })
          if (!taze || taze.deletedAt) {
            // hesap anonimleştirildiyse oturumu sonlandır
            return {}
          }
          token.rol = taze.rol
          token.ad = taze.ad
          token.soyad = taze.soyad
          token.kullaniciAdi = taze.kullaniciAdi ?? null
          token.picture = taze.avatarUrl ?? undefined
          token.email = taze.email
        } catch (err) {
          logger.error('auth.jwt_update', { err: String(err) })
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
        session.user.image = (token.picture as string | null) ?? null
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

export type MobilOturum = {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    rol: Rol
    ad: string
    soyad: string
    kullaniciAdi?: string | null
  }
  expires: string
}

const SALT = 'authjs.session-token'

/**
 * Cookie-first, Bearer-token-second session resolver.
 * Web istemciler cookie ile, mobil istemciler Authorization: Bearer <token> ile auth olur.
 */
export async function mobilAuth(req: NextRequest): Promise<MobilOturum | null> {
  // 1. Cookie session (web) — hızlı yol
  const oturum = await auth()
  if (oturum?.user?.id) return oturum as unknown as MobilOturum

  // 2. Bearer token (mobil)
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7).trim()
  if (!token) return null

  try {
    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: SALT,
    })
    if (!decoded?.id || !decoded?.email) return null
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null

    return {
      user: {
        id: String(decoded.id),
        email: decoded.email as string,
        name: (decoded.name as string | null) ?? null,
        image: (decoded.picture as string | null) ?? null,
        rol: decoded.rol as Rol,
        ad: decoded.ad as string,
        soyad: decoded.soyad as string,
        kullaniciAdi: (decoded.kullaniciAdi as string | null) ?? null,
      },
      expires: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  } catch {
    return null
  }
}

/**
 * Mobil login için JWE token üretir.
 * Sadece app/api/auth/mobile-login/route.ts tarafından kullanılır.
 */
export async function mobilTokenOlustur(kullanici: {
  id: number
  email: string
  ad: string
  soyad: string
  rol: string
  avatarUrl?: string | null
  kullaniciAdi?: string | null
}): Promise<{ token: string; expiresAt: string }> {
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
  const token = await encode({
    token: {
      id: String(kullanici.id),
      email: kullanici.email,
      name: `${kullanici.ad} ${kullanici.soyad}`,
      picture: kullanici.avatarUrl ?? null,
      rol: kullanici.rol,
      ad: kullanici.ad,
      soyad: kullanici.soyad,
      kullaniciAdi: kullanici.kullaniciAdi ?? null,
      exp,
    },
    secret: process.env.AUTH_SECRET!,
    salt: SALT,
  })
  return { token, expiresAt: new Date(exp * 1000).toISOString() }
}

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
