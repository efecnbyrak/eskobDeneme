import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { EsnafKart } from '@/components/public/EsnafKart'
import { KATEGORILER } from '@/lib/constants'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Esnaf } from '@/types'

interface Props {
  params: Promise<{ kategori: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori: slug } = await params
  const kat = KATEGORILER.find((k) => k.slug === slug)
  if (!kat) return { title: 'Kategori Bulunamadı | Müşteri Vitrin' }
  return {
    title: `${kat.ad} Esnafları | Müşteri Vitrin`,
    description: `Türkiye genelindeki ${kat.ad.toLowerCase()} esnaflarını keşfet.`,
  }
}

export default async function KategoriSayfasi({ params }: Props) {
  const { kategori: slug } = await params
  const kat = KATEGORILER.find((k) => k.slug === slug)

  if (!kat) {
    return (
      <div className="container-main" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 10 }}>
          Kategori Bulunamadı
        </h1>
        <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>
          &quot;{slug}&quot; adında bir kategori bulunmuyor.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/ara"
            style={{
              background: 'var(--color-primary)', color: 'white',
              fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            Tüm İşletmeleri Keşfet
          </Link>
          <Link
            href="/"
            style={{
              background: 'white', color: '#444',
              fontWeight: 600, fontSize: 14,
              padding: '12px 28px', borderRadius: 12,
              textDecoration: 'none',
              border: '1px solid #E0E0E0',
            }}
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  const [oturum, dbKat] = await Promise.all([
    auth(),
    prisma.kategori.findUnique({ where: { slug } }),
  ])
  const authenticated = !!oturum?.user?.id
  const userId = oturum?.user?.id ? Number(oturum.user.id) : null

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

  let favoriIdleri = new Set<number>()
  if (userId && esnaflar.length > 0) {
    const favoriler = await prisma.favori.findMany({
      where: { kullaniciId: userId },
      select: { esnafId: true },
    })
    favoriIdleri = new Set(favoriler.map((f) => f.esnafId))
  }

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
          {esnaflar.map((e: typeof esnaflar[0]) => <EsnafKart key={e.id} esnaf={e as unknown as Esnaf} authenticated={authenticated} favoriMi={favoriIdleri.has(e.id)} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>
            İçerik Bulunamadı
          </p>
          <p style={{ fontSize: 14, color: '#999' }}>
            Bu kategoride henüz kayıtlı işletme bulunmuyor.
          </p>
        </div>
      )}
    </div>
  )
}
