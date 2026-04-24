import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card } from '@/components/ui/Card'
import { RandevuTakvimClient } from './client'

export default async function RandevularSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          randevular: {
            orderBy: { tarih: 'desc' },
            include: { hizmet: true },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/kayit')

  return (
    <div>
      <TopBar baslik="Randevular" aciklama="Müşteri randevularını yönet" />
      <Card>
        <RandevuTakvimClient
          esnafId={kullanici.esnaf.id}
          randevular={kullanici.esnaf.randevular as unknown as import('@/types').Randevu[]}
        />
      </Card>
    </div>
  )
}
