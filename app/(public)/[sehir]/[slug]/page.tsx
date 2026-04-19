import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { HizmetListesi } from '@/components/public/HizmetListesi'
import { YorumListesi } from '@/components/public/YorumListesi'
import { RandevuWidget } from '@/components/public/RandevuWidget'
import { HaritaWidget } from '@/components/public/HaritaWidget'
import { WhatsAppButon } from '@/components/shared/WhatsAppButon'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { QRKodWidget } from '@/components/shared/QRKodWidget'
import { ortalamaPuan, isletmeAcikMi, formatTarih } from '@/lib/utils'
import type { Metadata } from 'next'
import type { Esnaf } from '@/types'

interface Props {
  params: Promise<{ sehir: string; slug: string }>
}

async function getEsnaf(slug: string) {
  return prisma.esnaf.findUnique({
    where: { slug },
    include: {
      kategori: true,
      hizmetler: { where: { aktif: true }, orderBy: { sira: 'asc' } },
      yorumlar: { where: { onaylı: true }, orderBy: { olusturmaT: 'desc' } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const esnaf = await getEsnaf(slug)
  if (!esnaf) return {}
  return {
    title: `${esnaf.isletmeAdi} | ${esnaf.sehir}`,
    description: esnaf.aciklama?.slice(0, 160) || `${esnaf.isletmeAdi} - ${esnaf.sehir}, ${esnaf.ilce}`,
    openGraph: {
      images: esnaf.kapakFoto ? [esnaf.kapakFoto] : [],
    },
  }
}

export default async function EsnafProfilSayfasi({ params }: Props) {
  const { slug } = await params
  const esnaf = await getEsnaf(slug)

  if (!esnaf || !esnaf.aktif) notFound()

  const puan = ortalamaPuan(esnaf.yorumlar as { puan: number }[])
  const acik = isletmeAcikMi(esnaf.calismaS as Record<string, { acik: string; kapali: string; kapali_gun?: boolean }> | null)
  const sayfaUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: esnaf.isletmeAdi,
    description: esnaf.aciklama,
    image: esnaf.kapakFoto,
    telephone: esnaf.telefon,
    address: {
      '@type': 'PostalAddress',
      addressLocality: esnaf.ilce,
      addressRegion: esnaf.sehir,
      addressCountry: 'TR',
      streetAddress: esnaf.adres,
    },
    ...(esnaf.enlem && esnaf.boylam && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: esnaf.enlem,
        longitude: esnaf.boylam,
      },
    }),
    aggregateRating: esnaf.yorumlar.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: puan.toFixed(1),
      reviewCount: esnaf.yorumlar.length,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Kapak */}
      <div className="relative h-64 md:h-80 bg-[var(--color-bg-muted)]">
        {esnaf.kapakFoto && (
          <Image src={esnaf.kapakFoto} alt={esnaf.isletmeAdi} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ana içerik */}
          <div className="flex-1 min-w-0">
            {/* Başlık */}
            <div className="flex items-start gap-4 mb-6">
              {esnaf.logoUrl && (
                <div className="w-16 h-16 rounded-[var(--radius-lg)] overflow-hidden border-2 border-white shadow-md shrink-0 -mt-10 relative">
                  <Image src={esnaf.logoUrl} alt="Logo" fill className="object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {esnaf.isletmeAdi}
                  </h1>
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: esnaf.kategori.renk }}
                  >
                    {esnaf.kategori.ikon} {esnaf.kategori.ad}
                  </Badge>
                  <Badge variant={acik ? 'success' : 'default'}>
                    {acik ? '🟢 Açık' : '⚫ Kapalı'}
                  </Badge>
                </div>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  📍 {esnaf.ilce}, {esnaf.sehir}
                  {esnaf.adres && ` — ${esnaf.adres}`}
                </p>
                {esnaf.yorumlar.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <YildizPuan puan={puan} />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {puan.toFixed(1)} ({esnaf.yorumlar.length} yorum)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {esnaf.aciklama && (
              <p className="text-[var(--color-text-secondary)] mb-8">{esnaf.aciklama}</p>
            )}

            {/* Hizmetler */}
            <section className="mb-8">
              <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Hizmetler
              </h2>
              <HizmetListesi hizmetler={esnaf.hizmetler as unknown as import('@/types').Hizmet[]} />
            </section>

            {/* Yorumlar */}
            <section className="mb-8">
              <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Yorumlar
              </h2>
              <YorumListesi yorumlar={esnaf.yorumlar as unknown as import('@/types').Yorum[]} />
            </section>

            {/* Harita */}
            {esnaf.enlem && esnaf.boylam && (
              <section>
                <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Konum
                </h2>
                <HaritaWidget enlem={esnaf.enlem} boylam={esnaf.boylam} baslik={esnaf.isletmeAdi} />
              </section>
            )}
          </div>

          {/* Sağ panel sticky */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]">
                <RandevuWidget
                  esnafId={esnaf.id}
                  hizmetler={esnaf.hizmetler as unknown as import('@/types').Hizmet[]}
                />
              </div>

              {esnaf.whatsapp && (
                <WhatsAppButon telefon={esnaf.whatsapp} className="w-full justify-center" />
              )}

              {esnaf.telefon && (
                <a
                  href={`tel:${esnaf.telefon}`}
                  className="flex items-center justify-center gap-2 w-full px-5 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-full)] text-sm hover:bg-[var(--color-bg-muted)] transition-colors"
                >
                  📞 {esnaf.telefon}
                </a>
              )}

              {/* QR */}
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex justify-center">
                <QRKodWidget url={sayfaUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
