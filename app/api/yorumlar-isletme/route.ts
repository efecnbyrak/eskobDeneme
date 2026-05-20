import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { basari, hata } from '@/lib/api'

export async function GET(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.email) return hata('Yetkisiz', 401)

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email },
    include: {
      esnaf: {
        include: {
          yorumlar: {
            orderBy: { olusturmaT: 'desc' },
            select: {
              id: true,
              puan: true,
              yorum: true,
              musteriAd: true,
              yanitlar: true,
              bildirildi: true,
              olusturmaT: true,
            },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) return hata('İşletme bulunamadı', 404)

  return basari({
    yorumlar: kullanici.esnaf.yorumlar.map((y) => ({
      ...y,
      olusturmaT: y.olusturmaT.toISOString(),
    })),
  })
}
