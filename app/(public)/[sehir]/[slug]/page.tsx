import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/Badge'
import { HizmetListesi } from '@/components/public/HizmetListesi'
import { YorumListesi } from '@/components/public/YorumListesi'
import { YorumFormu } from '@/components/public/YorumFormu'
import { RandevuWidget } from '@/components/public/RandevuWidget'
import { HaritaWidget } from '@/components/public/HaritaWidget'
import { WhatsAppButon } from '@/components/shared/WhatsAppButon'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { QRKodWidget } from '@/components/shared/QRKodWidget'
import { FavoriButon } from '@/components/public/FavoriButon'
import { VitrinGaleri } from '@/components/public/VitrinGaleri'
import { ViewTracker } from '@/components/public/ViewTracker'
import { ortalamaPuan, isletmeAcikMi } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ sehir: string; slug: string }>
}

// ISR — 1 saatte bir tazele (admin onay/yorum onay sonrası revalidatePath ile anlık güncellenir)
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const aktif = await prisma.esnaf.findMany({
      where: { aktif: true, onaylı: true },
      select: { slug: true, sehir: true },
      take: 200,
      orderBy: { olusturmaT: 'desc' },
    })
    return aktif.map((e) => ({
      sehir: e.sehir.toLowerCase(),
      slug: e.slug,
    }))
  } catch {
    return []
  }
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
    openGraph: { images: esnaf.kapakFoto ? [esnaf.kapakFoto] : [] },
  }
}

export default async function EsnafProfilSayfasi({ params }: Props) {
  const { slug } = await params
  const [esnaf, oturum] = await Promise.all([getEsnaf(slug), auth()])

  if (!esnaf || !esnaf.aktif) notFound()

  const authenticated = !!oturum?.user
  const kullaniciAd = authenticated
    ? `${oturum!.user.ad ?? ''} ${oturum!.user.soyad ?? ''}`.trim() || oturum!.user.name || null
    : null

  let favoriMi = false
  if (oturum?.user?.id) {
    const favori = await prisma.favori.findUnique({
      where: { kullaniciId_esnafId: { kullaniciId: parseInt(oturum.user.id), esnafId: esnaf.id } },
    })
    favoriMi = !!favori
  }

  const puan = ortalamaPuan(esnaf.yorumlar as { puan: number }[])
  const acik = isletmeAcikMi(esnaf.calismaS as Record<string, { acik: string; kapali: string; kapali_gun?: boolean }> | null)
  const sayfaUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`
  const fotograflar = esnaf.fotograflar ?? []

  return (
    <>
      {authenticated && <ViewTracker esnafId={esnaf.id} />}
      {/* Cover Image */}
      <div className="relative" style={{ height: '380px', background: 'var(--color-bg-muted)' }}>
        {esnaf.kapakFoto ? (
          <Image src={esnaf.kapakFoto} alt={esnaf.isletmeAdi} fill className="object-cover" priority />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${esnaf.kategori.renk}40, ${esnaf.kategori.renk}15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 80,
          }}>
            {esnaf.kategori.ikon}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />

        {/* Kategori badge — cover üzerinde */}
        <div className="absolute" style={{ top: 20, left: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            fontSize: 13, fontWeight: 700, color: esnaf.kategori.renk,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}>
            {esnaf.kategori.ikon} {esnaf.kategori.ad}
          </span>
        </div>

        {/* Açık/Kapalı badge */}
        <div className="absolute" style={{ top: 20, right: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            fontSize: 13, fontWeight: 700,
            color: acik ? '#059669' : '#6b7280',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}>
            {acik ? '🟢 Şu an Açık' : '⚫ Kapalı'}
          </span>
        </div>
      </div>

      <div className="container-main" style={{ paddingBottom: '64px' }}>
        {/* Başlık kartı */}
        <div style={{
          background: 'white', borderRadius: '20px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '28px 32px',
          marginTop: '-48px', marginBottom: '32px',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {esnaf.logoUrl && (
              <div className="relative" style={{
                width: 72, height: 72, borderRadius: 16,
                overflow: 'hidden', border: '3px solid white',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)', flexShrink: 0,
              }}>
                <Image src={esnaf.logoUrl} alt="Logo" fill className="object-cover" />
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="font-display" style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800, letterSpacing: '-0.01em',
                marginBottom: 8, lineHeight: 1.2,
              }}>
                {esnaf.isletmeAdi}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📍</span>
                <span>{esnaf.ilce}, {esnaf.sehir}{esnaf.adres ? ` — ${esnaf.adres}` : ''}</span>
              </p>
              {esnaf.yorumlar.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <YildizPuan puan={puan} />
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {puan.toFixed(1)} <span style={{ color: 'var(--color-text-tertiary)' }}>({esnaf.yorumlar.length} yorum)</span>
                  </span>
                </div>
              )}
            </div>

            {/* Favori Butonu — görünür konum */}
            <div style={{ flexShrink: 0 }}>
              <FavoriButon
                esnafId={esnaf.id}
                baslangicFavori={favoriMi}
                authenticated={authenticated}
                variant="inline"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px' }} className="flex-col lg:flex-row">
          {/* Ana İçerik */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {esnaf.aciklama && (
              <div style={{
                background: 'var(--color-bg-muted)', borderRadius: 16,
                padding: '24px 28px', marginBottom: '36px',
                borderLeft: `4px solid ${esnaf.kategori.renk}`,
              }}>
                <p style={{ color: 'var(--color-text)', fontSize: '15px', lineHeight: 1.9, fontWeight: 450 }}>
                  {esnaf.aciklama}
                </p>
              </div>
            )}

            {/* Vitrin Galerisi */}
            {fotograflar.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <SectionBaslik baslik="Vitrin" ikon="🖼️" />
                <VitrinGaleri fotograflar={fotograflar} isletmeAdi={esnaf.isletmeAdi} />
              </section>
            )}

            <section style={{ marginBottom: '48px' }}>
              <SectionBaslik baslik="Hizmetler" ikon="✨" />
              <HizmetListesi hizmetler={esnaf.hizmetler.map((h) => ({
                  ...h,
                  fiyat: Number(h.fiyat),
                })) as unknown as import('@/types').Hizmet[]} />
            </section>

            {/* Randevu Al — sadece mobilde */}
            <section className="lg:hidden" style={{ marginBottom: '48px' }}>
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-card)' }}>
                <RandevuWidget esnafId={esnaf.id} hizmetler={esnaf.hizmetler.map((h) => ({
                  ...h,
                  fiyat: Number(h.fiyat),
                })) as unknown as import('@/types').Hizmet[]} />
              </div>
              {(esnaf.whatsapp || esnaf.telefon) && (
                <div style={{ marginTop: 16, background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: 'var(--shadow-card)' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>İletişim</p>
                  {esnaf.whatsapp && <WhatsAppButon telefon={esnaf.whatsapp} className="w-full justify-center" />}
                  {esnaf.telefon && (
                    <a href={`tel:${esnaf.telefon}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 20px', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: 'var(--color-text)' }}>
                      📞 {esnaf.telefon}
                    </a>
                  )}
                </div>
              )}
            </section>

            {/* Yorumlar */}
            <section style={{ marginBottom: '48px' }}>
              <SectionBaslik
                baslik="Müşteri Yorumları"
                ikon="⭐"
                badge={esnaf.yorumlar.length > 0 ? `${esnaf.yorumlar.length}` : undefined}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <YorumFormu esnafId={esnaf.id} authenticated={authenticated} kullaniciAd={kullaniciAd} />
                <YorumListesi yorumlar={esnaf.yorumlar.map((y) => ({
                  ...y,
                  olusturmaT: y.olusturmaT.toISOString(),
                })) as unknown as import('@/types').Yorum[]} />
              </div>
            </section>

            {esnaf.enlem && esnaf.boylam && (
              <section>
                <SectionBaslik baslik="Konum" ikon="📍" />
                <HaritaWidget enlem={esnaf.enlem} boylam={esnaf.boylam} baslik={esnaf.isletmeAdi} />
              </section>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div style={{ width: '360px', flexShrink: 0 }} className="hidden lg:block">
            <div className="sticky" style={{ top: '96px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-card)' }}>
                <RandevuWidget esnafId={esnaf.id} hizmetler={esnaf.hizmetler.map((h) => ({
                  ...h,
                  fiyat: Number(h.fiyat),
                })) as unknown as import('@/types').Hizmet[]} />
              </div>

              {(esnaf.whatsapp || esnaf.telefon) && (
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>İletişim</p>
                  {esnaf.whatsapp && <WhatsAppButon telefon={esnaf.whatsapp} className="w-full justify-center" />}
                  {esnaf.telefon && (
                    <a href={`tel:${esnaf.telefon}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 20px', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: 'var(--color-text)' }}>
                      📞 {esnaf.telefon}
                    </a>
                  )}
                </div>
              )}

              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>QR Kod ile Paylaş</p>
                <QRKodWidget url={sayfaUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionBaslik({ baslik, ikon, badge }: { baslik: string; ikon: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
      <span style={{ fontSize: 20 }}>{ikon}</span>
      <h2 className="font-display" style={{ fontWeight: 700, fontSize: 20, flex: 1 }}>{baslik}</h2>
      {badge && (
        <span style={{
          padding: '2px 10px', borderRadius: 9999,
          background: 'var(--color-bg-muted)',
          fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)',
        }}>
          {badge}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'var(--color-border)', maxWidth: 120 }} />
    </div>
  )
}
