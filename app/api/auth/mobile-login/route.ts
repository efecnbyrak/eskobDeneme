import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { mobilTokenOlustur } from '@/lib/auth'
import { basari, hata } from '@/lib/api'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'

const GirisSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  sifre: z.string().min(1, 'Şifre gerekli.'),
})

export async function POST(req: NextRequest) {
  const ip = istemciKimligi(req)
  const limit = rateLimit(`mobile-login:${ip}`, 10, 60)
  if (!limit.basarili) {
    return hata('Çok fazla deneme. 1 dakika bekleyin.', 429)
  }

  const body = await req.json().catch(() => null)
  const parsed = GirisSchema.safeParse(body)
  if (!parsed.success) {
    return hata(parsed.error.issues[0]?.message ?? 'Geçersiz veri.', 400)
  }

  const email = parsed.data.email.toLowerCase().trim()

  const kullanici = await prisma.kullanici.findUnique({
    where: { email },
    select: {
      id: true, email: true, ad: true, soyad: true, rol: true,
      avatarUrl: true, kullaniciAdi: true, sifreHash: true, deletedAt: true,
    },
  })

  if (!kullanici || kullanici.deletedAt) {
    return hata('E-posta veya şifre hatalı.', 401)
  }

  const dogru = await bcrypt.compare(parsed.data.sifre, kullanici.sifreHash)
  if (!dogru) {
    return hata('E-posta veya şifre hatalı.', 401)
  }

  const { token, expiresAt } = await mobilTokenOlustur(kullanici)

  logger.info('mobile-login.basarili', { kullaniciId: kullanici.id })

  return basari({
    token,
    expiresAt,
    user: {
      id: String(kullanici.id),
      email: kullanici.email,
      ad: kullanici.ad,
      soyad: kullanici.soyad,
      rol: kullanici.rol,
      avatarUrl: kullanici.avatarUrl,
      kullaniciAdi: kullanici.kullaniciAdi,
    },
  })
}
