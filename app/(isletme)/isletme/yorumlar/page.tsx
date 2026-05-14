import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { YorumlarClient } from './YorumlarClient'

export const dynamic = 'force-dynamic'

export default async function YorumlarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
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
              onaylı: true,
              bildirildi: true,
              olusturmaT: true,
            },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const yorumlar = kullanici.esnaf.yorumlar
  // Ortalama sadece onaylı/görünür yorumlardan hesaplanır
  const gorunurYorumlar = yorumlar.filter((y) => y.onaylı)
  const ortalama = gorunurYorumlar.length
    ? (gorunurYorumlar.reduce((s, y) => s + y.puan, 0) / gorunurYorumlar.length).toFixed(1)
    : null

  return (
    <YorumlarClient
      yorumlar={yorumlar.map((y) => ({
        ...y,
        olusturmaT: y.olusturmaT.toISOString(),
      }))}
      ortalama={ortalama}
    />
  )
}
