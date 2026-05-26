import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { KampanyalarClient } from './KampanyalarClient'

export const dynamic = 'force-dynamic'

export default async function KampanyalarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          hizmetler: {
            where: { aktif: true },
            orderBy: { sira: 'asc' },
            include: { hizmetKategorisi: true },
          },
          hizmetKategorileri: {
            where: { ustId: null },
            orderBy: { sira: 'asc' },
            include: { altlar: { orderBy: { sira: 'asc' } } },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const hizmetler = kullanici.esnaf.hizmetler
  const kategoriler = kullanici.esnaf.hizmetKategorileri

  return (
    <KampanyalarClient
      hizmetler={hizmetler.map((h) => ({
        id: h.id,
        ad: h.ad,
        fiyat: Number(h.fiyat),
        indirimYuzde: h.indirimYuzde,
        indirimBitis: h.indirimBitis?.toISOString() ?? null,
        hizmetKategorisiId: h.hizmetKategorisiId ?? null,
      }))}
      kategoriler={kategoriler.map((k) => ({
        id: k.id,
        ad: k.ad,
        altlar: k.altlar.map((a) => ({ id: a.id, ad: a.ad })),
      }))}
    />
  )
}
