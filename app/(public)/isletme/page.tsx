import Link from 'next/link'
import { auth } from '@/lib/auth'
import { ScrollRevealInit } from '@/components/public/ScrollReveal'
import { StatsSection } from '@/components/public/StatsCounter'

export const metadata = {
  title: 'İşletmeler İçin | Eskob',
  description: 'Dijital vitrin kur, randevu yönet, müşteri kazan.',
}

const OZELLIKLER = [
  { ikon: '🏪', baslik: 'Dijital Vitrin', aciklama: 'Dakikalar içinde profesyonel işletme profili oluştur. Fotoğraf, hizmet ve konum bilgilerini ekle.' },
  { ikon: '📅', baslik: '7/24 Randevu', aciklama: 'Müşteriler istediği zaman randevu alsın. Seni aradıklarında müsait olman gerekmiyor.' },
  { ikon: '⭐', baslik: 'Yorum & Puanlama', aciklama: 'Müşteri yorumlarını topla, güvenilirliğini artır ve yeni müşteri çek.' },
  { ikon: '📊', baslik: 'İşletme Paneli', aciklama: 'Randevularını, müşterilerini ve gelirini tek bir panelden yönet.' },
  { ikon: '🔍', baslik: 'Arama Sonuçları', aciklama: 'Platform içi arama ve kategori sayfalarında üst sıralarda görün.' },
  { ikon: '💬', baslik: 'Müşteri İletişimi', aciklama: 'Randevu onayları ve hatırlatmaları otomatik gönderilsin.' },
]

const ADIMLAR = [
  { no: '01', baslik: 'Ücretsiz Kaydol', aciklama: 'İşletme hesabı oluştur, kredi kartı gerekmez.' },
  { no: '02', baslik: 'Vitrini Kur', aciklama: 'Hizmetlerini, fiyatlarını ve fotoğraflarını ekle.' },
  { no: '03', baslik: 'Müşteri Kazan', aciklama: 'Arama sonuçlarında görün, randevuları yönet.' },
]

export default async function IsletmeSayfasi() {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 800, height: 500, background: '#1a2744', filter: 'blur(140px)', borderRadius: '100%', opacity: 0.15 }} />

        <div className="container-main relative" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            className="backdrop-blur-md"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.85)', border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)', fontSize: '14px', fontWeight: 600,
              color: '#1a2744', marginBottom: '40px'
            }}
          >
            <span style={{ fontSize: '20px' }}>🏪</span>
            İşletmeler için dijital çözüm
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
              maxWidth: '900px', marginBottom: '28px'
            }}
          >
            <span style={{ color: 'var(--color-text)' }}>İşletmeni </span>
            <span style={{ color: '#1a2744' }}>Dijitale Taşı</span>
            <br />
            <span style={{ color: 'var(--color-text)' }}>Müşteri Kazan</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--color-text-secondary)', maxWidth: '600px', lineHeight: 1.7, fontWeight: 500, marginBottom: '48px' }}>
            Ücretsiz dijital vitrin kur, online randevu sistemi kur ve binlerce potansiyel müşteriye ulaş. Kaydolmak 2 dakika sürer.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {girisYapti ? (
              <Link href="/panel">
                <button style={{ height: 56, padding: '0 36px', fontSize: '16px', fontWeight: 700, background: '#1a2744', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,39,68,0.3)' }}>
                  Panele Git →
                </button>
              </Link>
            ) : (
              <>
                <Link href="/kayit">
                  <button style={{ height: 56, padding: '0 36px', fontSize: '16px', fontWeight: 700, background: '#1a2744', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,39,68,0.3)' }}>
                    Ücretsiz Başla →
                  </button>
                </Link>
                <Link href="/giris">
                  <button style={{ height: 56, padding: '0 36px', fontSize: '16px', fontWeight: 600, background: 'white', color: '#1a2744', borderRadius: '14px', border: '2px solid #1a2744', cursor: 'pointer' }}>
                    Giriş Yap
                  </button>
                </Link>
              </>
            )}
          </div>

          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Kredi kartı gerekmez · Ücretsiz kurulum · 5 dakikada hazır
          </p>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <StatsSection />

      {/* ═══ ÖZELLİKLER ═══ */}
      <section style={{ background: 'var(--color-bg-muted)', paddingTop: '80px', paddingBottom: '80px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
              Her Şey Dahil
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--color-text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              İşletmeni büyütmek için ihtiyacın olan her araç tek platformda.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {OZELLIKLER.map((o, i) => (
              <div
                key={o.baslik}
                className="card-elite"
                data-reveal="up"
                data-reveal-delay={String((i % 3) + 1)}
                style={{ padding: '32px', borderRadius: '20px' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{o.ikon}</div>
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
      <section style={{ background: 'white', paddingTop: '100px', paddingBottom: '100px' }}>
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
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1a2744', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Adım {a.no}
                </span>
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
        style={{ background: '#1a2744', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="container-main relative" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-reveal="up">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '24px', lineHeight: 1.2, maxWidth: '700px' }}>
              İşletmeni Hemen Platforma Taşı
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '48px', fontSize: '17px', maxWidth: '500px', fontWeight: 500, lineHeight: 1.7 }}>
              3.200+ işletme dijitale taşındı ve müşteri tabanını büyüttü. Sıra sende.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/kayit">
                <button style={{ height: 56, padding: '0 40px', fontSize: '16px', fontWeight: 700, background: 'white', color: '#1a2744', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  Ücretsiz Kayıt Ol
                </button>
              </Link>
              <Link href="/">
                <button style={{ height: 56, padding: '0 36px', fontSize: '15px', fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.8)', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                  ← Ana Sayfa
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
