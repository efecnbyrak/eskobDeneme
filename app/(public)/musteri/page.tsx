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
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#F27A1A" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    baslik: 'Kolay Keşfet',
    aciklama: 'Şehrin, kategorin veya hizmet adına göre en iyi işletmeleri saniyeler içinde bul.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#F27A1A" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    baslik: 'Online Randevu',
    aciklama: '7/24 randevu al. Telefon etmene gerek yok, sıra bekleme yok.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#F27A1A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    baslik: 'Güvenilir Yorumlar',
    aciklama: 'Gerçek müşteri yorumlarını oku, en kaliteli hizmeti seç.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#F27A1A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    baslik: 'Favoriler',
    aciklama: 'Beğendiğin işletmeleri favorile, bir daha arama.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#F27A1A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    baslik: 'Yakınımdakiler',
    aciklama: 'Bulunduğun konuma yakın işletmeleri kolayca bul.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#F27A1A" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    baslik: 'Kişiselleştirilmiş',
    aciklama: 'İlgi alanlarına göre sana özel işletme önerileri al.',
  },
]

export default async function MusteriSayfasi() {
  const oturum = await auth()
  const girisYapti = !!oturum?.user?.id

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollRevealInit />
      <style>{`
        .giris-btn-musteri {
          display: inline-block;
          width: 140px;
          height: 52px;
          border-radius: 14px;
          border: 1px solid #F27A1A;
          position: relative;
          overflow: hidden;
          transition: all 0.5s ease-in;
          z-index: 1;
          color: #F27A1A;
          background: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        .giris-btn-musteri::before,
        .giris-btn-musteri::after {
          content: '';
          position: absolute;
          top: 0;
          width: 0;
          height: 100%;
          transform: skew(15deg);
          transition: all 0.5s;
          overflow: hidden;
          z-index: -1;
        }
        .giris-btn-musteri::before { left: -10px; background: #c45e0a; }
        .giris-btn-musteri::after  { right: -10px; background: #F27A1A; }
        .giris-btn-musteri:hover::before,
        .giris-btn-musteri:hover::after { width: 58%; }
        .giris-btn-musteri:hover { color: #fff; border-color: #F27A1A; transition: 0.3s; }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--color-bg)', paddingTop: '120px', paddingBottom: '100px' }}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            opacity: 0.18,
            backgroundImage: `
              linear-gradient(to right, var(--color-border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 800, height: 500, background: '#F27A1A', filter: 'blur(160px)', borderRadius: '100%', opacity: 0.12 }} />

        <div className="container-main relative" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(242,122,26,0.08)', border: '1px solid rgba(242,122,26,0.2)',
              fontSize: '14px', fontWeight: 600,
              color: '#F27A1A', marginBottom: '40px',
            }}
          >
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '9999px', background: '#F27A1A', opacity: 0.75 }} />
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', width: 8, height: 8, background: '#F27A1A' }} />
            </span>
            3.200+ aktif işletme seni bekliyor
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
              maxWidth: '900px', marginBottom: '28px',
            }}
          >
            <span style={{ color: 'var(--color-text)' }}>En İyi Hizmeti </span>
            <span style={{ color: '#F27A1A' }}>Yakınında</span>
            <br />
            <span style={{ color: 'var(--color-text)' }}>Bul ve Randevu Al</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--color-text-secondary)', maxWidth: '600px', lineHeight: 1.7, fontWeight: 500, marginBottom: '40px' }}>
            Berber, güzellik, spor, restoran ve daha fazlası. Şehrine en yakın en iyi işletmeleri keşfet, hemen online randevu al.
          </p>

          <div style={{ width: '100%', maxWidth: '640px', marginBottom: '32px' }}>
            <HeroArama araYolu="/musteri/ara" />
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {!girisYapti && (
              <>
                <Link href="/musteri/kayit">
                  <button style={{ height: 52, padding: '0 32px', fontSize: '15px', fontWeight: 700, background: '#F27A1A', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(242,122,26,0.35)' }}>
                    Ücretsiz Kayıt Ol
                  </button>
                </Link>
                <Link href="/musteri/giris">
                  <button className="giris-btn-musteri" style={{ height: 52, padding: '0 28px', fontSize: '15px', fontWeight: 600, background: 'white', color: '#F27A1A', borderRadius: '14px', border: '2px solid #F27A1A', cursor: 'pointer' }}>
                    Giriş Yap
                  </button>
                </Link>
              </>
            )}
            {girisYapti && (
              <Link href="/musteri/genel">
                <button style={{ height: 52, padding: '0 32px', fontSize: '15px', fontWeight: 700, background: '#F27A1A', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(242,122,26,0.35)' }}>
                  Hesabıma Git →
                </button>
              </Link>
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
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 20px', borderRadius: '9999px',
              background: 'rgba(242,122,26,0.08)', border: '1px solid rgba(242,122,26,0.2)',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
              textTransform: 'uppercase' as const, color: '#F27A1A', marginBottom: '24px',
            }}>
              Neden Eskob?
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
              Her Şey Bir Arada
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
                style={{ padding: '32px', borderRadius: '20px', borderTop: '3px solid #F27A1A' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(242,122,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {a.ikon}
                </div>
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
        style={{ background: '#F27A1A', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute pointer-events-none" style={{ top: -80, right: -80, width: 280, height: 280, background: '#ff9a45', opacity: 0.4, borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="container-main relative" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-reveal="up">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '24px', lineHeight: 1.2, maxWidth: '700px', margin: '0 auto 24px' }}>
              Hemen Kaydol, İlk Randevunu Al
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '48px', fontSize: '17px', maxWidth: '480px', fontWeight: 500, lineHeight: 1.7, margin: '0 auto 48px' }}>
              Ücretsiz hesap oluştur ve binlerce işletmeye anında erişim kazan.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/musteri/kayit">
                <button style={{ height: 56, padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#F27A1A', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                  Ücretsiz Kayıt Ol
                </button>
              </Link>
              <Link href="/musteri/ara">
                <button style={{ height: 56, padding: '0 36px', fontSize: '15px', fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.9)', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.4)', cursor: 'pointer' }}>
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
