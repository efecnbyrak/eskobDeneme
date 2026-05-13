import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { RandevuTakvimClient } from '@/app/(dashboard)/isletme/panel/randevular/client'
import type { Randevu } from '@/types'

export default async function RandevularSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

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

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Randevular</h1>
        <p className="text-slate-500 text-sm mt-0.5">Müşteri randevularını yönetin ve durumlarını güncelleyin</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <RandevuTakvimClient
          esnafId={kullanici.esnaf.id}
          randevular={kullanici.esnaf.randevular as unknown as Randevu[]}
        />
      </div>
    </div>
  )
}
