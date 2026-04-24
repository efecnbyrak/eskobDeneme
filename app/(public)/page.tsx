import Link from 'next/link'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
import { HeroArama } from '@/components/public/HeroArama'
import { KategoriSlider } from '@/components/public/KategoriSlider'
import { StatsSection } from '@/components/public/StatsCounter'
import { ScrollRevealInit } from '@/components/public/ScrollReveal'
import { Button } from '@/components/ui/Button'
import type { Esnaf } from '@/types'

async function onecikarilan(): Promise<Esnaf[]> {
  try {
    const esnaflar = await prisma.esnaf.findMany({
      where: { aktif: true, onaylı: true },
      include: {
        kategori: true,
        yorumlar: { select: { puan: true } },
        hizmetler: { where: { aktif: true }, take: 3 },
      },
      orderBy: { olusturmaT: 'desc' },
      take: 10,
    })
    if (esnaflar.length === 0) {
      return [
        {
          id: '1', slug: 'ozkan-berber', isletmeAdi: 'Özkan Erkek Kuaförü', aktif: true, onaylı: true,
          sehir: 'İstanbul', ilce: 'Kadıköy', adres: 'Moda Cd.', kategoriId: '1',
          kategori: { id: '1', ad: 'Berber', ikon: '✂️', renk: '#F27A1A', slug: 'berber', sira: 1 },
          yorumlar: [{ id: '1', puan: 5, musteriAd: 'A', esnafId: '1', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '1', ad: 'Saç Kesimi', fiyat: 200, aktif: true, esnafId: '1', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '2', slug: 'lezzet-duragi', isletmeAdi: 'Lezzet Durağı Ev Yemekleri', aktif: true, onaylı: true,
          sehir: 'Ankara', ilce: 'Çankaya', adres: 'Tunalı Hilmi Cd.', kategoriId: '2',
          kategori: { id: '2', ad: 'Restoran', ikon: '🍽️', renk: '#0BC15C', slug: 'restoran', sira: 2 },
          yorumlar: [{ id: '2', puan: 4, musteriAd: 'B', esnafId: '2', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '2', ad: 'Günün Menüsü', fiyat: 150, aktif: true, esnafId: '2', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '3', slug: 'fit-life-gym', isletmeAdi: 'Fit Life Spor Salonu', aktif: true, onaylı: true,
          sehir: 'Antalya', ilce: 'Muratpaşa', adres: 'Lara', kategoriId: '3',
          kategori: { id: '3', ad: 'Spor', ikon: '💪', renk: '#81B29A', slug: 'spor', sira: 3 },
          yorumlar: [{ id: '3', puan: 5, musteriAd: 'C', esnafId: '3', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '3', ad: 'Aylık Üyelik', fiyat: 800, aktif: true, esnafId: '3', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '4', slug: 'papatya-cicekcilik', isletmeAdi: 'Papatya Çiçekçilik', aktif: true, onaylı: true,
          sehir: 'Bursa', ilce: 'Nilüfer', adres: 'FSM Bulvarı', kategoriId: '4',
          kategori: { id: '4', ad: 'Çiçekçi', ikon: '🌸', renk: '#E07A5F', slug: 'cicekci', sira: 4 },
          yorumlar: [{ id: '4', puan: 5, musteriAd: 'D', esnafId: '4', olusturmaT: new Date(), onaylı: true }],
          hizmetler: [{ id: '4', ad: 'Buket', fiyat: 400, aktif: true, esnafId: '4', sira: 1, olusturmaT: new Date() }]
        },
        {
          id: '5', slug: 'guzellik-kosesi', isletmeAdi: 'Güzellik Köşesi', aktif: true, onaylı: true,
          sehir: 'İzmir', ilce: 'Bornova', adres: 'Sanayi Sitesi', kategoriId: '5',
          kategori: { id: '5', ad: 'Güzellik', ikon: '💅', renk: '#F2CC8F', slug: 'guzellik', sira: 5 },
          yorumlar: [],
          hizmetler: []
        }
      ] as unknown as Esnaf[]
    }
    return esnaflar as unknown as Esnaf[]
  } catch {
    return []
  }
}

const DEMO_FOTO_SEED = ['berber', 'kafe', 'spor', 'guzellik', 'tamirci', 'restoran']

export default async function AnaSayfa() {
  const [esnaflar, oturum] = await Promise.all([onecikarilan(), auth()])
  const authenticated = !!oturum?.user?.id

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollRevealInit />

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--color-bg)', paddingTop: '120px', paddingBottom: '100px' }}
      >
        {/* Grid BG */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            opacity: 0.2,
            backgroundImage: `
              linear-gradient(to right, var(--color-border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
          }}
        />

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 800, height: 500, background: 'var(--color-primary-light)', filter: 'blur(120px)', borderRadius: '100%', opacity: 0.6 }} />

        {/* Floating business photos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {DEMO_FOTO_SEED.map((seed, i) => {
            const positions = [
              { top: '8%', left: '3%' },
              { top: '60%', left: '1%' },
              { top: '15%', right: '2%' },
              { top: '55%', right: '4%' },
              { top: '38%', left: '8%' },
              { top: '35%', right: '8%' },
            ]
            const pos = positions[i] ?? { top: '50%', left: '50%' }
            return (
              <div
                key={seed}
                className="hidden xl:block"
                style={{
                  position: 'absolute',
                  ...pos,
                  width: 88, height: 88,
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '3px solid white',
                  opacity: 0.75,
                  animation: `floatCard ${3.5 + i * 0.7}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                <img
                  src={`https://picsum.photos/seed/${seed}/88/88`}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )
          })}
        </div>

        <style>{`
          @keyframes floatCard {
            from { transform: translateY(0px) rotate(-2deg); }
            to   { transform: translateY(-18px) rotate(2deg); }
          }
        `}</style>

        <div className="container-main relative" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            className="backdrop-blur-md"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.8)', border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)', fontSize: '14px', fontWeight: 600,
              color: 'var(--color-primary)', marginBottom: '40px'
            }}
          >
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '9999px', background: 'var(--color-success)', opacity: 0.75 }} />
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', width: 8, height: 8, background: 'var(--color-success)' }} />
            </span>
            3.200+ İşletme Sizi Bekliyor
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
              maxWidth: '900px', marginBottom: '32px'
            }}
          >
            <span style={{ color: 'var(--color-text)' }}>Yakınındaki En İyi </span>
            <span style={{ color: 'var(--color-primary)' }}>İşletmeleri Keşfet</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text-secondary)', maxWidth: '640px', lineHeight: 1.7, fontWeight: 500, marginBottom: '40px' }}>
            Berber, güzellik salonu, restoran ve daha fazlası — online randevu al, yorum yap, favori işletmelerini takip et.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
            <a href="/musteri/kayit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '52px', padding: '0 32px', fontSize: '16px', fontWeight: 700, background: 'var(--color-primary)', color: 'white', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              Ücretsiz Üye Ol
            </a>
            <a href="/ara" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '52px', padding: '0 32px', fontSize: '16px', fontWeight: 600, background: 'white', color: 'var(--color-primary)', borderRadius: '14px', textDecoration: 'none', border: '1.5px solid var(--color-border)' }}>
              İşletmelere Göz At
            </a>
          </div>

          <div style={{ width: '100%', maxWidth: '640px', marginTop: '40px', marginBottom: '32px' }}>
            <HeroArama />
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.02em', marginTop: '8px' }}>
            Ücretsiz üyelik · Kolay randevu · 7/24 erişim
          </p>
        </div>
      </section>

      {/* ═══ STATS (animated counter) ═══ */}
      <StatsSection />

      {/* ═══ KATEGORİLER ═══ */}
      <section style={{ background: 'var(--color-bg-muted)', paddingTop: '80px', paddingBottom: '80px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
              Popüler Kategoriler
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
              İhtiyacın olan hizmeti kolayca bul, en iyisi ile çalış.
            </p>
          </div>
          <div data-reveal="up" data-reveal-delay="2">
            <KategoriSlider />
          </div>
        </div>
      </section>

      {/* ═══ ÖNE ÇIKAN ESNAFLAR ═══ */}
      <section style={{ background: 'white', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container-main">
          <div data-reveal="left" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '48px' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
                Öne Çıkan Esnaflar
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '600px' }}>
                Yakınındaki en popüler işletmeleri keşfet, hemen randevunu oluştur.
              </p>
            </div>
            <Link href="/ara">
              <Button variant="secondary" size="sm">Tümünü İncele →</Button>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {esnaflar.length > 0
              ? esnaflar.map((e, i) => (
                  <div key={e.id} data-reveal="up" data-reveal-delay={String(Math.min(i % 4 + 1, 5))}>
                    <EsnafKart esnaf={e} authenticated={authenticated} />
                  </div>
                ))
              : Array.from({ length: 5 }).map((_, i) => <EsnafKartSkeleton key={i} />)
            }
          </div>
        </div>
      </section>

      {/* ═══ NASIL ÇALIŞIR ═══ */}
      <section style={{ background: 'var(--color-bg)', paddingTop: '100px', paddingBottom: '100px', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 24px', borderRadius: '9999px',
              background: 'white', fontSize: '13px', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase' as const,
              color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)', marginBottom: '32px'
            }}>
              Basit · Hızlı · Etkili
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '24px', letterSpacing: '-0.01em' }}>
              Nasıl Çalışır?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '17px', lineHeight: 1.7, fontWeight: 500 }}>
              Sadece 3 adımda işletmeni dijitale taşı ve hemen yeni müşteriler kazanmaya başla.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { ikon: '🔍', adim: '01', baslik: 'İşletme Ara', aciklama: 'Şehrine, kategorine veya hizmet türüne göre yakınındaki en iyi işletmeleri bul.' },
              { ikon: '📅', adim: '02', baslik: 'Randevu Al', aciklama: 'Beğendiğin işletmeden tek tıkla online randevu al, 7/24 müsaitlik görüntüle.' },
              { ikon: '⭐', adim: '03', baslik: 'Değerlendir', aciklama: 'Aldığın hizmeti puanla, yorum yaz ve diğer kullanıcılara yol göster.' },
            ].map((item, i) => (
              <div
                key={item.adim}
                className="card-elite"
                data-reveal={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                data-reveal-delay={String(i + 1)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '44px 28px', borderRadius: '24px' }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>
                  Aşama {item.adim}
                </span>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '28px' }}>
                  {item.ikon}
                </div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: '20px', color: 'var(--color-text)', marginBottom: '14px' }}>
                  {item.baslik}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
                  {item.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--color-primary)', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute pointer-events-none" style={{ top: -128, right: -128, width: 384, height: 384, background: 'white', opacity: 0.07, borderRadius: '50%', filter: 'blur(80px)' }} />

        <div className="container-main relative" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-reveal="up">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', fontWeight: 700, color: 'white', marginBottom: '32px', lineHeight: 1.15, maxWidth: '800px', letterSpacing: '-0.01em' }}>
              Hemen Üye Ol, Kolayca Randevu Al
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '56px', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '600px', fontWeight: 500, lineHeight: 1.7 }}>
              3 binden fazla aktif işletme seni bekliyor. Ücretsiz hesap aç, favori işletmeni bul, anında randevunu oluştur.
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/musteri/kayit">
                <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '60px', padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: 'var(--color-primary)', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                  Ücretsiz Hesap Oluştur
                </button>
              </Link>
              <Link href="/ara">
                <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '60px', padding: '0 40px', fontSize: '16px', fontWeight: 600, background: 'transparent', color: 'white', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                  İşletmelere Göz At
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
