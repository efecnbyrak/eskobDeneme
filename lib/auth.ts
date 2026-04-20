import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim()
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD

async function ensureSuperAdmin(emailOrUsername: string, sifre: string) {
  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) return null
  if (emailOrUsername.toLowerCase().trim() !== SUPER_ADMIN_EMAIL.toLowerCase()) return null
  if (sifre !== SUPER_ADMIN_PASSWORD) return null

  // DB'de unique email olarak sakla — kullanıcı adını email alanına koy
  const dbEmail = SUPER_ADMIN_EMAIL.includes('@')
    ? SUPER_ADMIN_EMAIL
    : `${SUPER_ADMIN_EMAIL}@superadmin.local`

  const sifreHash = await bcrypt.hash(sifre, 12)
  const mevcut = await prisma.kullanici.findUnique({ where: { email: dbEmail } })
  if (mevcut) {
    return prisma.kullanici.update({
      where: { id: mevcut.id },
      data: { rol: 'SUPER_ADMIN', sifreHash },
    })
  }
  return prisma.kullanici.create({
    data: {
      email: dbEmail,
      sifreHash,
      ad: 'Super',
      soyad: 'Admin',
      rol: 'SUPER_ADMIN',
    },
  })
}

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
        const email = (credentials?.email as string | undefined)?.toLowerCase().trim()
        const sifre = credentials?.sifre as string | undefined
        if (!email || !sifre) return null

        // Super admin kullanıcı adı veya email ile giriş yapabilir
        const superAdmin = await ensureSuperAdmin(email, sifre)
        if (superAdmin) {
          return {
            id: superAdmin.id,
            email: superAdmin.email,
            name: `${superAdmin.ad} ${superAdmin.soyad}`,
            image: superAdmin.avatarUrl,
            rol: superAdmin.rol,
          }
        }

        const kullanici = await prisma.kullanici.findUnique({ where: { email } })
        if (!kullanici) return null

        const dogru = await bcrypt.compare(sifre, kullanici.sifreHash)
        if (!dogru) return null

        return {
          id: kullanici.id,
          email: kullanici.email,
          name: `${kullanici.ad} ${kullanici.soyad}`,
          image: kullanici.avatarUrl,
          rol: kullanici.rol,
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
        const taze = await prisma.kullanici.findUnique({ where: { id: token.id as string } })
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
