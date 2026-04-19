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
    <div className="container-main py-12 lg:py-16">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{kat.ikon}</span>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {kat.ad}
          </h1>
        </div>
        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
          {esnaflar.length} esnaf bulundu
        </p>
      </div>

      {esnaflar.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {esnaflar.map((e: typeof esnaflar[0]) => <EsnafKart key={e.id} esnaf={e as unknown as Esnaf} />)}
        </div>
      ) : (
        <p className="text-center text-[var(--color-text-secondary)] py-20 text-base">
          Bu kategoride henüz esnaf bulunmuyor.
        </p>
      )}
    </div>
  )
}
