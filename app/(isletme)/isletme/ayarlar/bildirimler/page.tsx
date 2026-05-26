import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { BildirimlerClient } from './BildirimlerClient'

export const dynamic = 'force-dynamic'

export default async function BildirimlerSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { select: { id: true, bildirimAyarlari: true } } },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const ayarlar = (kullanici.esnaf.bildirimAyarlari as Record<string, boolean> | null) ?? {}

  return (
    <BildirimlerClient
      esnafId={kullanici.esnaf.id}
      baslangicAyarlari={ayarlar}
    />
  )
}
