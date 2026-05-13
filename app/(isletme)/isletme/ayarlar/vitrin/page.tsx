import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { VitrinEditor } from '@/components/dashboard/VitrinEditor'
import type { Esnaf } from '@/types'

export default async function VitrinAyarlariSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { include: { kategori: true } } },
  })

  if (!kullanici?.esnaf) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Vitrin Ayarları</h1>
          <p className="text-slate-500 text-sm mt-0.5">İşletme profilinizi ve görsellerinizi düzenleyin</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <p className="text-5xl mb-4">🏪</p>
          <p className="font-semibold text-slate-700 mb-2">Henüz işletme profili oluşturulmamış</p>
          <p className="text-slate-400 text-sm">Lütfen önce işletme kaydınızı tamamlayın.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Vitrin Ayarları</h1>
        <p className="text-slate-500 text-sm mt-0.5">İşletme profilinizi ve görsellerinizi düzenleyin</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <VitrinEditor esnaf={kullanici.esnaf as unknown as Esnaf} />
      </div>
    </div>
  )
}
