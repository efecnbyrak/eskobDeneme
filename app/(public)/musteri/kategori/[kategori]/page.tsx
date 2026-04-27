import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
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
    title: `${kat.ad} Esnafları | Müşteri Vitrin`,
    description: `Türkiye genelindeki ${kat.ad.toLowerCase()} esnaflarını keşfet.`,
  }
}

export default async function MusteriKategoriSayfasi({ params }: Props) {
  const { kategori: slug } = await params
  const kat = KATEGORILER.find((k) => k.slug === slug)
  if (!kat) notFound()

  const [oturum, dbKat] = await Promise.all([
    auth(),
    prisma.kategori.findUnique({ where: { slug } }),
  ])
  const authenticated = !!oturum?.user?.id

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
    <div className="container-main" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <span style={{ fontSize: '40px' }}>{kat.ikon}</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700 }}>
            {kat.ad}
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          {esnaflar.length} esnaf bulundu
        </p>
      </div>

      {esnaflar.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {esnaflar.map((e: typeof esnaflar[0]) => <EsnafKart key={e.id} esnaf={e as unknown as Esnaf} authenticated={authenticated} />)}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '80px 20px', fontSize: '15px' }}>
          Bu kategoride henüz esnaf bulunmuyor.
        </p>
      )}
    </div>
  )
}
