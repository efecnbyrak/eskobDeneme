import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { VitrinEditor } from '@/components/dashboard/VitrinEditor'
import type { Esnaf } from '@/types'

export default async function VitrinSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { include: { kategori: true } } },
  })

  if (!kullanici?.esnaf) redirect('/kayit')

  return (
    <div>
      <TopBar baslik="Vitrinim" aciklama="İşletme bilgilerini ve görsellerini düzenle" />
      <VitrinEditor esnaf={kullanici.esnaf as unknown as Esnaf} />
    </div>
  )
}
