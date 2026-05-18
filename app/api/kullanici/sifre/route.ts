import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { basari, hata } from '@/lib/api'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const body = await req.json().catch(() => null)
    if (!body) return hata('Geçersiz veri', 400)

    const { mevcutSifre, yeniSifre } = body
    if (!mevcutSifre || !yeniSifre) return hata('Tüm alanlar zorunludur', 400)
    if (yeniSifre.length < 6) return hata('Yeni şifre en az 6 karakter olmalıdır', 400)

    const kullanici = await prisma.kullanici.findUnique({
      where: { email: oturum.user.email },
      select: { sifreHash: true },
    })
    if (!kullanici) return hata('Kullanıcı bulunamadı', 404)

    const dogru = await bcrypt.compare(mevcutSifre, kullanici.sifreHash)
    if (!dogru) return hata('Mevcut şifre hatalı', 400)

    const yeniHash = await bcrypt.hash(yeniSifre, 12)
    await prisma.kullanici.update({
      where: { email: oturum.user.email },
      data: { sifreHash: yeniHash },
    })

    return basari({ mesaj: 'Şifre başarıyla güncellendi' })
  } catch {
    return hata('Sunucu hatası', 500)
  }
}
