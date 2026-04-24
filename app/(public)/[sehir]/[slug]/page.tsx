import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ sehir: string; slug: string }>
}

async function getEsnaf(slug: string) {
  return prisma.esnaf.findUnique({
    where: { slug },
    include: { kategori: true },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const esnaf = await getEsnaf(slug)
  if (!esnaf) return {}
  return {
    title: `${esnaf.isletmeAdi} | ${esnaf.sehir}`,
    description: esnaf.aciklama?.slice(0, 160) || `${esnaf.isletmeAdi} - ${esnaf.sehir}, ${esnaf.ilce}`,
  }
}

export default async function EsnafProfilSayfasi({ params }: Props) {
  const { sehir, slug } = await params
  const esnaf = await getEsnaf(slug)

  if (!esnaf || !esnaf.aktif) notFound()

  redirect(`/musteri/${sehir}/${slug}`)
}
