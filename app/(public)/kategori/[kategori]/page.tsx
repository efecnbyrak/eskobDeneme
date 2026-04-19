import { prisma } from '@/lib/db'
import { EsnafKart } from '@/components/public/EsnafKart'
import { KATEGORILER } from '@/lib/constants'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Esnaf } from '@/types'

interface Props {
  params: Promise<{ kategori: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori: slug } = await params
  const kat = KATEGORILER.find((k) => k.slug === slug)
  if (!kat) return {}
  return {
    title: `${kat.ad} Esnafları | Esnaf Vitrin`,
    description: `Türkiye genelindeki ${kat.ad.toLowerCase()} esnaflarını keşfet.`,
  }
}

export default async function KategoriSayfasi({ params }: Props) {
  const { kategori: slug } = await params
  const kat = KATEGORILER.find((k) => k.slug === slug)
  if (!kat) notFound()

  const dbKat = await prisma.kategori.findUnique({ where: { slug } })

  const esnaflar = dbKat
    ? await prisma.esnaf.findMany({
        where: { aktif: true, onaylı: true, kategoriId: dbKat.id },
        include: {
          kategori: true,
          yorumlar: { select: { puan: true } },
          hizmetler: { where: { aktif: true }, take: 3 },
        },
        orderBy: { olusturmaT: 'desc' },
        take: 24,
      })
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{kat.ikon}</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {kat.ad}
          </h1>
        </div>
        <p className="text-[var(--color-text-secondary)]">
          {esnaflar.length} esnaf bulundu
        </p>
      </div>

      {esnaflar.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {esnaflar.map((e: typeof esnaflar[0]) => <EsnafKart key={e.id} esnaf={e as unknown as Esnaf} />)}
        </div>
      ) : (
        <p className="text-center text-[var(--color-text-secondary)] py-16">
          Bu kategoride henüz esnaf bulunmuyor.
        </p>
      )}
    </div>
  )
}
