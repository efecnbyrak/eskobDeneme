import { notFound, redirect } from 'next/navigation'
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
import { ortalamaPuan, isletmeAcikMi } from '@/lib/utils'
import type { Metadata } from 'next'

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
    openGraph: { images: esnaf.kapakFoto ? [esnaf.kapakFoto] : [] },
  }
}

export default async function EsnafProfilSayfasi({ params }: Props) {
  const { sehir, slug } = await params
  const [esnaf, oturum] = await Promise.all([getEsnaf(slug), auth()])

  if (!esnaf || !esnaf.aktif) notFound()

  if (!oturum?.user) {
    redirect(`/musteri/giris?callbackUrl=/${sehir}/${esnaf.slug}`)
  }

  const kullaniciAd = `${oturum.user.ad ?? ''} ${oturum.user.soyad ?? ''}`.trim() || oturum.user.name || null

  let favoriMi = false
  if (oturum.user.id) {
    const favori = await prisma.favori.findUnique({
      where: { kullaniciId_esnafId: { kullaniciId: parseInt(oturum.user.id), esnafId: esnaf.id } },
    })
    favoriMi = !!favori
  }

  const puan = ortalamaPuan(esnaf.yorumlar as { puan: number }[])
  const acik = isletmeAcikMi(esnaf.calismaS as Record<string, { acik: string; kapali: string; kapali_gun?: boolean }> | null)
  const sayfaUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  return (
    <>
      {/* Cover Image */}
      <div className="relative" style={{ height: '320px', background: 'var(--color-bg-muted)' }}>
        {esnaf.kapakFoto && (
          <Image src={esnaf.kapakFoto} alt={esnaf.isletmeAdi} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
        <div className="absolute" style={{ top: 16, right: 16 }}>
          <FavoriButon esnafId={esnaf.id} baslangicFavori={favoriMi} authenticated={true} />
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        <div style={{ display: 'flex', gap: '48px' }} className="flex-col lg:flex-row">
          {/* Ana İçerik */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
              {esnaf.logoUrl && (
                <div className="relative" style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', border: '2px solid white', boxShadow: 'var(--shadow-md)', flexShrink: 0, marginTop: '-40px' }}>
                  <Image src={esnaf.logoUrl} alt="Logo" fill className="object-cover" />
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700 }}>
                    {esnaf.isletmeAdi}
                  </h1>
                  <Badge className="text-white" style={{ backgroundColor: esnaf.kategori.renk }}>
                    {esnaf.kategori.ikon} {esnaf.kategori.ad}
                  </Badge>
                  <Badge variant={acik ? 'success' : 'default'}>
                    {acik ? '🟢 Açık' : '⚫ Kapalı'}
                  </Badge>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '12px' }}>
                  📍 {esnaf.ilce}, {esnaf.sehir}
                  {esnaf.adres && ` — ${esnaf.adres}`}
                </p>
                {esnaf.yorumlar.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <YildizPuan puan={puan} />
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      {puan.toFixed(1)} ({esnaf.yorumlar.length} yorum)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {esnaf.aciklama && (
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px', fontSize: '15px', lineHeight: 1.8 }}>{esnaf.aciklama}</p>
            )}

            <section style={{ marginBottom: '48px' }}>
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: '20px', marginBottom: '24px' }}>Hizmetler</h2>
              <HizmetListesi hizmetler={esnaf.hizmetler as unknown as import('@/types').Hizmet[]} />
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: '20px', marginBottom: '24px' }}>Yorumlar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <YorumFormu esnafId={esnaf.id} authenticated={true} kullaniciAd={kullaniciAd} />
                <YorumListesi yorumlar={esnaf.yorumlar as unknown as import('@/types').Yorum[]} />
              </div>
            </section>

            {esnaf.enlem && esnaf.boylam && (
              <section>
                <h2 className="font-display" style={{ fontWeight: 700, fontSize: '20px', marginBottom: '24px' }}>Konum</h2>
                <HaritaWidget enlem={esnaf.enlem} boylam={esnaf.boylam} baslik={esnaf.isletmeAdi} />
              </section>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div style={{ width: '360px', flexShrink: 0 }} className="hidden lg:block">
            <div className="sticky" style={{ top: '96px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
                <RandevuWidget
                  esnafId={esnaf.id}
                  hizmetler={esnaf.hizmetler as unknown as import('@/types').Hizmet[]}
                />
              </div>

              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>İletişim</p>
                {esnaf.whatsapp && <WhatsAppButon telefon={esnaf.whatsapp} className="w-full justify-center" />}
                {esnaf.telefon && (
                  <a href={`tel:${esnaf.telefon}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 20px', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', color: 'var(--color-text)' }}>
                    📞 {esnaf.telefon}
                  </a>
                )}
              </div>

              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>QR Kod ile Paylaş</p>
                <QRKodWidget url={sayfaUrl} />
              </div>
            </div>
          </div>

          {/* Mobile sidebar */}
          <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px' }}>
              <RandevuWidget esnafId={esnaf.id} hizmetler={esnaf.hizmetler as unknown as import('@/types').Hizmet[]} />
            </div>
            {esnaf.whatsapp && <WhatsAppButon telefon={esnaf.whatsapp} className="w-full justify-center" />}
            {esnaf.telefon && (
              <a href={`tel:${esnaf.telefon}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px 24px', border: '1px solid var(--color-border)', borderRadius: '16px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', color: 'var(--color-text)' }}>
                📞 {esnaf.telefon}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
