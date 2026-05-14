import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { basari, hata } from '@/lib/api'
import { temizMetin } from '@/lib/sanitize'

export async function PUT(req: NextRequest) {
  try {
    const oturum = await mobilAuth(req)
    if (!oturum?.user?.email) return hata('Yetkisiz', 401)

    const body = await req.json().catch(() => null)
    if (!body) return hata('Geçersiz veri', 400)

    const { ad, soyad } = body
    if (!ad?.trim() || !soyad?.trim()) return hata('Ad ve soyad zorunludur', 400)

    const guncellenen = await prisma.kullanici.update({
      where: { email: oturum.user.email },
      data: {
        ad: temizMetin(ad, 60),
        soyad: temizMetin(soyad, 60),
      },
      select: { id: true, ad: true, soyad: true, email: true, plan: true },
    })

    return basari(guncellenen)
  } catch {
    return hata('Sunucu hatası', 500)
  }
}
