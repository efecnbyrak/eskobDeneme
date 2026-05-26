import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { OnizlemeClient } from './OnizlemeClient'

export const dynamic = 'force-dynamic'

export default async function OnizlemeSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { select: { slug: true, sehir: true, isletmeAdi: true } } },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const { slug, sehir } = kullanici.esnaf

  // Vitrin URL'si: /{sehir}/{slug} formatında
  const vitrinUrl = sehir && slug ? `/${encodeURIComponent(sehir)}/${encodeURIComponent(slug)}` : '/'

  return <OnizlemeClient vitrinUrl={vitrinUrl} slug={slug ?? ''} />
}
