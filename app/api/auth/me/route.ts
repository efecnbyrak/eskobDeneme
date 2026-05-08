import { NextRequest } from 'next/server'
import { mobilAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'

export async function GET(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) {
    return hata('Yetkisiz.', 401)
  }

  const kullanici = await prisma.kullanici.findUnique({
    where: { id: parseInt(oturum.user.id) },
    select: {
      id: true, ad: true, soyad: true, email: true,
      rol: true, avatarUrl: true, telefon: true, kullaniciAdi: true,
    },
  })

  if (!kullanici) {
    return hata('Kullanıcı bulunamadı.', 401)
  }

  return basari({
    id: String(kullanici.id),
    email: kullanici.email,
    ad: kullanici.ad,
    soyad: kullanici.soyad,
    name: `${kullanici.ad} ${kullanici.soyad}`,
    avatarUrl: kullanici.avatarUrl,
    telefon: kullanici.telefon,
    rol: kullanici.rol,
    kullaniciAdi: kullanici.kullaniciAdi,
  })
}
