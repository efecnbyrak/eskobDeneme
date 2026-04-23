import Link from 'next/link'
import { auth } from '@/lib/auth'
import { ScrollRevealInit } from '@/components/public/ScrollReveal'
import { HeroArama } from '@/components/public/HeroArama'
import { KategoriSlider } from '@/components/public/KategoriSlider'

export const metadata = {
  title: 'Müşteriler İçin | Eskob',
  description: 'Yakınındaki işletmeleri keşfet, online randevu al.',
}

const AVANTAJLAR = [
  { ikon: '🔍', baslik: 'Kolay Keşfet', aciklama: 'Şehrin, kategorin veya hizmet adına göre en iyi işletmeleri saniyeler içinde bul.' },
  { ikon: '📅', baslik: 'Online Randevu', aciklama: '7/24 randevu al. Telefon etmene gerek yok, sıra bekleme yok.' },
  { ikon: '⭐', baslik: 'Güvenilir Yorumlar', aciklama: 'Gerçek müşteri yorumlarını oku, en kaliteli hizmeti seç.' },
  { ikon: '❤️', baslik: 'Favoriler', aciklama: 'Beğendiğin işletmeleri favorile, bir daha arama.' },
  { ikon: '🗺️', baslik: 'Yakınımdakiler', aciklama: 'Bulunduğun konuma yakın işletmeleri kolayca bul.' },
  { ikon: '🎯', baslik: 'Kişiselleştirilmiş', aciklama: 'İlgi alanlarına göre sana özel işletme önerileri al.' },
]

export default async function MusteriSayfasi() {
  const oturum = await auth()
  const girisYapti = !!oturum?.user?.id

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollRevealInit />

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--color-bg)', paddingTop: '120px', paddingBottom: '100px' }}
      >
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 800, height: 500, background: '#1a4432', filter: 'blur(140px)', borderRadius: '100%', opacity: 0.15 }} />

        <div className="container-main relative" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            className="backdrop-blur-md"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.85)', border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)', fontSize: '14px', fontWeight: 600,
              color: '#1a4432', marginBottom: '40px'
            }}
          >
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '9999px', background: 'var(--color-success)', opacity: 0.75 }} />
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', width: 8, height: 8, background: 'var(--color-success)' }} />
            </span>
            3.200+ aktif işletme seni bekliyor
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
              maxWidth: '900px', marginBottom: '28px'
            }}
          >
            <span style={{ color: 'var(--color-text)' }}>En İyi Hizmeti </span>
            <span style={{ color: '#1a4432' }}>Yakınında</span>
            <br />
            <span style={{ color: 'var(--color-text)' }}>Bul ve Randevu Al</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--color-text-secondary)', maxWidth: '600px', lineHeight: 1.7, fontWeight: 500, marginBottom: '40px' }}>
            Berber, güzellik, spor, restoran ve daha fazlası. Şehrine en yakın en iyi işletmeleri keşfet, hemen online randevu al.
          </p>

          <div style={{ width: '100%', maxWidth: '640px', marginBottom: '32px' }}>
            <HeroArama />
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {!girisYapti && (
              <>
                <Link href="/kayit">
                  <button style={{ height: 52, padding: '0 32px', fontSize: '15px', fontWeight: 700, background: '#1a4432', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,68,50,0.3)' }}>
                    Ücretsiz Kayıt Ol
                  </button>
                </Link>
                <Link href="/giris">
                  <button style={{ height: 52, padding: '0 28px', fontSize: '15px', fontWeight: 600, background: 'white', color: '#1a4432', borderRadius: '14px', border: '2px solid #1a4432', cursor: 'pointer' }}>
                    Giriş Yap
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ KATEGORİLER ═══ */}
      <section style={{ background: 'var(--color-bg-muted)', paddingTop: '80px', paddingBottom: '80px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
              Ne Arıyorsun?
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
              Kategoriye göre hızlıca filtrele, ihtiyacın olan hizmeti bul.
            </p>
          </div>
          <div data-reveal="up" data-reveal-delay="2">
            <KategoriSlider />
          </div>
        </div>
      </section>

      {/* ═══ AVANTAJLAR ═══ */}
      <section style={{ background: 'white', paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
              Neden Eskob?
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--color-text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Hizmet aramayı kolaylaştırdık. Randevu almayı kolaylaştırdık.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {AVANTAJLAR.map((a, i) => (
              <div
                key={a.baslik}
                className="card-elite"
                data-reveal="up"
                data-reveal-delay={String((i % 3) + 1)}
                style={{ padding: '32px', borderRadius: '20px' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{a.ikon}</div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--color-text)', marginBottom: '10px' }}>
                  {a.baslik}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {a.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#1a4432', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="container-main relative" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-reveal="up">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '24px', lineHeight: 1.2, maxWidth: '700px' }}>
              Hemen Kaydol, İlk Randevunu Al
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '48px', fontSize: '17px', maxWidth: '480px', fontWeight: 500, lineHeight: 1.7 }}>
              Ücretsiz hesap oluştur ve binlerce işletmeye anında erişim kazan.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/kayit">
                <button style={{ height: 56, padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#1a4432', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  Ücretsiz Kayıt Ol
                </button>
              </Link>
              <Link href="/ara">
                <button style={{ height: 56, padding: '0 36px', fontSize: '15px', fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.8)', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                  İşletmeleri Keşfet
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
