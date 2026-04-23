import Link from 'next/link'
import { auth } from '@/lib/auth'
import { ScrollRevealInit } from '@/components/public/ScrollReveal'
import { IsletmeStats } from '@/components/public/IsletmeStats'

export const metadata = {
  title: 'İşletmeler İçin | Eskob',
  description: 'Dijital vitrin kur, randevu yönet, müşteri kazan.',
}

const OZELLIKLER = [
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#1A2744" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    baslik: 'Dijital Vitrin',
    aciklama: 'Dakikalar içinde profesyonel işletme profili oluştur. Fotoğraf, hizmet ve konum bilgilerini ekle.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#1A2744" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    baslik: '7/24 Randevu',
    aciklama: 'Müşteriler istediği zaman randevu alsın. Seni aradıklarında müsait olman gerekmiyor.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#1A2744" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    baslik: 'Yorum & Puanlama',
    aciklama: 'Müşteri yorumlarını topla, güvenilirliğini artır ve yeni müşteri çek.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#1A2744" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    baslik: 'İşletme Paneli',
    aciklama: 'Randevularını, müşterilerini ve gelirini tek bir panelden yönet.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#1A2744" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    baslik: 'Arama Sonuçları',
    aciklama: 'Platform içi arama ve kategori sayfalarında üst sıralarda görün.',
  },
  {
    ikon: (
      <svg width="28" height="28" fill="none" stroke="#1A2744" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    baslik: 'Müşteri İletişimi',
    aciklama: 'Randevu onayları ve hatırlatmaları otomatik gönderilsin.',
  },
]

const ADIMLAR = [
  {
    no: '01',
    baslik: 'Ücretsiz Kaydol',
    aciklama: 'İşletme hesabı oluştur, kredi kartı gerekmez.',
    ikon: (
      <svg width="36" height="36" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    ),
  },
  {
    no: '02',
    baslik: 'Vitrini Kur',
    aciklama: 'Hizmetlerini, fiyatlarını ve fotoğraflarını ekle.',
    ikon: (
      <svg width="36" height="36" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    no: '03',
    baslik: 'Müşteri Kazan',
    aciklama: 'Arama sonuçlarında görün, randevuları yönet.',
    ikon: (
      <svg width="36" height="36" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
]

export default async function IsletmeSayfasi() {
  const oturum = await auth()
  const girisYapti = !!oturum?.user?.id

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollRevealInit />
      <style>{`
        .giris-btn-isletme {
          display: inline-block;
          width: 160px;
          height: 56px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.4);
          position: relative;
          overflow: hidden;
          transition: all 0.5s ease-in;
          z-index: 1;
          color: rgba(255,255,255,0.85);
          background: transparent;
          font-size: 16px;
          font-weight: 600;
        }
        .giris-btn-isletme::before,
        .giris-btn-isletme::after {
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
        .giris-btn-isletme::before { left: -10px; background: #0f1a30; }
        .giris-btn-isletme::after  { right: -10px; background: #253a6e; }
        .giris-btn-isletme:hover::before,
        .giris-btn-isletme:hover::after { width: 58%; }
        .giris-btn-isletme:hover { color: #fff; border-color: rgba(255,255,255,0.7); transition: 0.3s; }
      `}</style>

      {/* ═══ HERO — tam karanlık #1A2744 arka plan ═══ */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ background: '#1A2744', paddingTop: '120px', paddingBottom: '110px' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow spot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 700, height: 400, background: '#3a5fa0', filter: 'blur(120px)', borderRadius: '100%', opacity: 0.4 }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{ height: 120, background: 'linear-gradient(to bottom, transparent, #1A2744)' }} />

        <div className="container-main relative" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '14px', fontWeight: 600,
              color: 'rgba(255,255,255,0.9)', marginBottom: '40px',
            }}
          >
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '9999px', background: '#4ade80', opacity: 0.75 }} />
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', width: 8, height: 8, background: '#4ade80' }} />
            </span>
            3.200+ işletme Eskob'da büyüyor
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
              maxWidth: '900px', marginBottom: '28px', color: 'white',
            }}
          >
            İşletmeni{' '}
            <span style={{ color: '#7eb3ff' }}>Dijitale Taşı</span>
            <br />
            Müşteri Kazan
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '580px', lineHeight: 1.8, fontWeight: 500, marginBottom: '52px' }}>
            Ücretsiz dijital vitrin kur, online randevu sistemi kur ve binlerce potansiyel müşteriye ulaş. Kaydolmak 2 dakika sürer.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {girisYapti ? (
              <Link href="/panel">
                <button style={{ height: 56, padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                  Panele Git →
                </button>
              </Link>
            ) : (
              <>
                <Link href="/isletme/kayit">
                  <button style={{ height: 56, padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                    Ücretsiz Başla →
                  </button>
                </Link>
                <Link href="/isletme/giris">
                  <button className="giris-btn-isletme" style={{ height: 56, padding: '0 36px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
                    Giriş Yap
                  </button>
                </Link>
              </>
            )}
          </div>

          <p style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
            Kredi kartı gerekmez · Ücretsiz kurulum · 5 dakikada hazır
          </p>

          {/* Stats row */}
          <IsletmeStats />
        </div>
      </section>

      {/* ═══ ÖZELLİKLER ═══ */}
      <section
        id="ozellikler"
        style={{ background: 'var(--color-bg-muted)', paddingTop: '100px', paddingBottom: '100px', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 20px', borderRadius: '9999px',
              background: 'rgba(26,39,68,0.08)', border: '1px solid rgba(26,39,68,0.15)',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
              textTransform: 'uppercase' as const, color: '#1A2744', marginBottom: '24px',
            }}>
              Her Şey Dahil
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
              İşletmeni Büyütmek İçin Her Araç
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--color-text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Tek platformda dijital varlık, randevu yönetimi ve müşteri ilişkileri.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {OZELLIKLER.map((o, i) => (
              <div
                key={o.baslik}
                className="card-elite"
                data-reveal="up"
                data-reveal-delay={String((i % 3) + 1)}
                style={{ padding: '32px', borderRadius: '20px', borderTop: '3px solid #1A2744' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(26,39,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {o.ikon}
                </div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--color-text)', marginBottom: '10px' }}>
                  {o.baslik}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {o.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NASIL ÇALIŞIR ═══ */}
      <section
        id="nasil-calisir"
        style={{ background: 'white', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
              3 Adımda Başla
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '17px', lineHeight: 1.7, fontWeight: 500 }}>
              Kurulum karmaşık değil. Bugün başla, bugün müşteri kazan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px', maxWidth: '900px', margin: '0 auto' }}>
            {ADIMLAR.map((a, i) => (
              <div
                key={a.no}
                className="card-elite"
                data-reveal={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                data-reveal-delay={String(i + 1)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '44px 28px', borderRadius: '24px' }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A2744', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
                  Adım {a.no}
                </span>
                <div style={{ width: 72, height: 72, borderRadius: 18, background: '#1A2744', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', boxShadow: '0 8px 24px rgba(26,39,68,0.3)' }}>
                  {a.ikon}
                </div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: '20px', color: 'var(--color-text)', marginBottom: '12px' }}>
                  {a.baslik}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
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
        style={{ background: '#1A2744', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute pointer-events-none" style={{ top: -100, right: -100, width: 300, height: 300, background: '#3a5fa0', opacity: 0.3, borderRadius: '50%', filter: 'blur(80px)' }} />
        <div className="container-main relative" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-reveal="up">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '24px', lineHeight: 1.2, maxWidth: '700px', margin: '0 auto 24px' }}>
              İşletmeni Hemen Platforma Taşı
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '48px', fontSize: '17px', maxWidth: '500px', fontWeight: 500, lineHeight: 1.7, margin: '0 auto 48px' }}>
              <strong style={{ color: 'white' }}>3.200+ işletme dijitale taşındı</strong> ve müşteri tabanını büyüttü. Sıra sende.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/isletme/kayit">
                <button style={{ height: 56, padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  Ücretsiz Kayıt Ol
                </button>
              </Link>
              <Link href="/">
                <button style={{ height: 56, padding: '0 36px', fontSize: '15px', fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.8)', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                  ← Ana Sayfaya Dön
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
