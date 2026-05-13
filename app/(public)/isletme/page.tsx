import Link from 'next/link'
import { auth } from '@/lib/auth'
import { ScrollRevealInit } from '@/components/public/ScrollReveal'
import { IsletmeStats } from '@/components/public/IsletmeStats'

export const metadata = {
  title: 'İşletmeler İçin | Eskob',
  description: 'Dijital vitrin kur, randevu yönet, müşteri kazan. Türkiye\'nin en hızlı büyüyen işletme platformu.',
}

const OZELLIKLER = [
  {
    ikon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    baslik: 'Dijital Vitrin',
    aciklama: 'Dakikalar içinde profesyonel işletme profilinizi oluşturun. Fotoğraf, hizmet listesi, fiyatlar ve konum bilgilerinizi ekleyin.',
    renk: '#3b82f6',
  },
  {
    ikon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    baslik: '7/24 Online Randevu',
    aciklama: 'Müşterileriniz siz uyurken bile randevu alabilsin. Telefon trafiğinden kurtulun, randevularınızı otomatik yönetin.',
    renk: '#10b981',
  },
  {
    ikon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    baslik: 'Yorum & Puanlama',
    aciklama: 'Müşteri yorumlarınızı toplayın, güvenilirliğinizi artırın ve organik olarak yeni müşteri çekin.',
    renk: '#f59e0b',
  },
  {
    ikon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    baslik: 'İşletme Analitikleri',
    aciklama: 'Kaç kişi vitrinizi gördü, kaç randevu alındı, WhatsApp\'ınıza kaç kez tıklandı — tüm veriler panelde.',
    renk: '#8b5cf6',
  },
  {
    ikon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    baslik: 'WhatsApp Entegrasyonu',
    aciklama: 'Vitrininizdeki WhatsApp butonu ile müşteriler tek tıkla size ulaşsın. Her tıklamayı takip edin.',
    renk: '#22c55e',
  },
  {
    ikon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    baslik: 'Keşfet & Aranın',
    aciklama: 'Platform içi arama ve kategori sayfalarında öne çıkın. Yakınlarındaki müşteriler sizi bulsun.',
    renk: '#ef4444',
  },
]

const ADIMLAR = [
  {
    no: '01',
    baslik: 'Ücretsiz Hesap Aç',
    aciklama: 'İşletme hesabı oluşturun, kredi kartı veya taahhüt gerekmez. 2 dakikada tamamlayın.',
    ikon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    ),
  },
  {
    no: '02',
    baslik: 'Vitrininizi Kurun',
    aciklama: 'İşletme bilgilerini, hizmetleri, fiyatları ve fotoğrafları ekleyin. Müşteri profili hazır.',
    ikon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    no: '03',
    baslik: 'Müşteri Kazanın',
    aciklama: 'Randevuları yönetin, yorumları takip edin ve işletmenizi büyütün. Her şey tek panelde.',
    ikon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
]

const PLANLAR = [
  {
    ad: 'Silver',
    fiyat: '₺0',
    altBaslik: 'Ücretsiz başla',
    aktif: true,
    ozellikler: [
      'Sınırsız hizmet & fiyat listesi',
      'Online randevu sistemi',
      'Müşteri yorumları & puanlama',
      'WhatsApp entegrasyonu',
      'İşletme istatistikleri',
      'QR kod vitrin paylaşımı',
      'Kategori & arama görünürlüğü',
      'Mobil uyumlu panel',
    ],
  },
  {
    ad: 'Gold',
    fiyat: '₺200',
    altBaslik: 'En popüler',
    aktif: false,
    populer: true,
    ozellikler: [
      'Silver\'ın tüm özellikleri',
      'Öne çıkan listeleme',
      'Gelişmiş analitik raporlar',
      'Özel işletme URL\'si',
      'E-posta hatırlatmaları',
      'SMS bildirim paketi (100/ay)',
      'Öncelikli arama sıralaması',
      'Çoklu çalışan takvimi',
    ],
  },
  {
    ad: 'Premium',
    fiyat: '₺500',
    altBaslik: 'Tam güç',
    aktif: false,
    ozellikler: [
      'Gold\'un tüm özellikleri',
      'Öncelikli destek',
      'Sınırsız SMS bildirimleri',
      'API erişimi',
      'Reklam kampanya desteği',
      'Özel onboarding',
      'Çoklu şube yönetimi',
      'Özel entegrasyon paketi',
    ],
  },
]

export default async function IsletmeSayfasi() {
  const oturum = await auth()
  const isletmeGirisli = oturum?.user?.rol === 'BUSINESS'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <ScrollRevealInit />

      {/* ═══ NAVBAR ═══ */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(26,39,68,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="container-main"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
        >
          <Link href="/isletme" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 36, height: 36, borderRadius: 9, background: 'white', color: '#1A2744', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, letterSpacing: '-0.03em' }}>
              EV
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
              İşletme <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>Vitrini</span>
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/" style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500, textDecoration: 'none', padding: '0 12px', display: 'none' }} className="sm:block">
              Ana Sayfa
            </Link>
            {isletmeGirisli ? (
              <Link href="/isletme/panel" style={{ height: 38, padding: '0 20px', fontSize: 14, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 10, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                Panele Git →
              </Link>
            ) : (
              <>
                <Link
                  href="/isletme/giris"
                  style={{ height: 38, padding: '0 18px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/isletme/kayit"
                  style={{ height: 38, padding: '0 18px', fontSize: 14, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 10, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: 'linear-gradient(160deg, #1A2744 0%, #1e3a6e 50%, #1A2744 100%)',
          paddingTop: 'clamp(80px, 12vw, 140px)',
          paddingBottom: 'clamp(80px, 12vw, 140px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: '#3a5fa0', filter: 'blur(130px)', borderRadius: '50%', opacity: 0.35 }} />

        <div className="container-main" style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 9999,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
              marginBottom: 36,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', opacity: 0.7 }} />
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
            </span>
            3.200+ işletme Eskob&apos;da büyüyor
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
              fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.08,
              color: 'white', maxWidth: 860, marginBottom: 24,
            }}
          >
            İşletmenizi{' '}
            <span style={{ color: '#7eb3ff' }}>Dijitale Taşıyın</span>
            <br />
            Müşteri Kazanmaya Başlayın
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.18rem)', color: 'rgba(255,255,255,0.65)', maxWidth: 560, lineHeight: 1.8, fontWeight: 500, marginBottom: 48 }}>
            Ücretsiz dijital vitrin kurun, 7/24 online randevu alın ve binlerce potansiyel müşteriye ulaşın. Kurulum 5 dakika sürer.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
            {isletmeGirisli ? (
              <Link href="/isletme/panel">
                <button style={{ height: 56, padding: '0 40px', fontSize: 16, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                  Panele Git →
                </button>
              </Link>
            ) : (
              <>
                <Link href="/isletme/kayit">
                  <button style={{ height: 56, padding: '0 40px', fontSize: 16, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                    Ücretsiz Başla →
                  </button>
                </Link>
                <Link href="/isletme/giris">
                  <button style={{ height: 56, padding: '0 36px', fontSize: 16, fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.85)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                    Giriş Yap
                  </button>
                </Link>
              </>
            )}
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            Kredi kartı gerekmez · Tamamen ücretsiz · Hemen başlayın
          </p>

          <IsletmeStats />
        </div>
      </section>

      {/* ═══ ÖZELLİKLER ═══ */}
      <section style={{ background: 'white', paddingTop: 'clamp(72px, 10vw, 112px)', paddingBottom: 'clamp(72px, 10vw, 112px)' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: 'rgba(26,39,68,0.07)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#1A2744', marginBottom: 20 }}>
              Neler Sunuyoruz
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#0f172a', marginBottom: 16, letterSpacing: '-0.02em' }}>
              İşletmenizi Büyütmek İçin Her Araç
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              Tek platformda dijital varlık, randevu sistemi ve müşteri yönetimi. Hepsi ücretsiz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
            {OZELLIKLER.map((o, i) => (
              <div
                key={o.baslik}
                className="card-elite"
                data-reveal="up"
                data-reveal-delay={String((i % 3) + 1)}
                style={{ padding: 28, borderRadius: 20, borderTop: `3px solid ${o.renk}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${o.renk}18`, color: o.renk, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {o.ikon}
                </div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, color: '#0f172a', marginBottom: 10 }}>
                  {o.baslik}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>
                  {o.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NASIL ÇALIŞIR ═══ */}
      <section style={{ background: '#f8fafc', paddingTop: 'clamp(72px, 10vw, 112px)', paddingBottom: 'clamp(72px, 10vw, 112px)', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: 'rgba(26,39,68,0.07)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#1A2744', marginBottom: 20 }}>
              Nasıl Çalışır
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              3 Adımda Başlayın
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 460, margin: '16px auto 0', lineHeight: 1.7 }}>
              Karmaşık kurulum yok. Bugün başlayın, bugün müşteri kazanın.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28, maxWidth: 920, margin: '0 auto', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 52, left: '16%', right: '16%', height: 2, background: 'linear-gradient(to right, #1A2744, #3b82f6, #1A2744)', opacity: 0.15, display: 'none' }} className="lg:block" />

            {ADIMLAR.map((a, i) => (
              <div
                key={a.no}
                className="card-elite"
                data-reveal={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                data-reveal-delay={String(i + 1)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 28px', borderRadius: 24 }}
              >
                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #1A2744, #2d4a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(26,39,68,0.28)' }}>
                    {a.ikon}
                  </div>
                  <span style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', border: '2px solid #e2e8f0', fontSize: 10, fontWeight: 800, color: '#1A2744', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {a.no}
                  </span>
                </div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', marginBottom: 10 }}>
                  {a.baslik}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75 }}>
                  {a.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FİYATLANDIRMA ═══ */}
      <section style={{ background: 'white', paddingTop: 'clamp(72px, 10vw, 112px)', paddingBottom: 'clamp(72px, 10vw, 112px)' }}>
        <div className="container-main">
          <div data-reveal="up" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: '#dcfce7', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#166534', marginBottom: 20 }}>
              Fiyatlandırma
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 16 }}>
              İşletmenize Uygun Plan
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.75 }}>
              Silver ile ücretsiz başlayın, büyüdükçe planınızı yükseltin.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1040, margin: '0 auto', alignItems: 'start' }}>
            {PLANLAR.map((plan, i) => (
              <div
                key={plan.ad}
                data-reveal="up"
                data-reveal-delay={String(i + 1)}
                style={{
                  background: plan.populer ? 'linear-gradient(145deg, #1A2744, #243260)' : 'white',
                  borderRadius: 28,
                  padding: 'clamp(28px, 4vw, 44px)',
                  boxShadow: plan.populer ? '0 24px 64px rgba(26,39,68,0.28)' : '0 4px 24px rgba(0,0,0,0.07)',
                  border: plan.populer ? 'none' : '1.5px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: plan.populer ? 'scale(1.03)' : 'none',
                }}
              >
                {plan.populer && (
                  <>
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
                  </>
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {plan.populer && (
                    <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: '#3b82f6', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'white', marginBottom: 18 }}>
                      En Popüler
                    </span>
                  )}
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: plan.populer ? 'rgba(255,255,255,0.5)' : '#94a3b8' }}>
                      {plan.ad}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 44, fontWeight: 800, color: plan.populer ? 'white' : '#0f172a', lineHeight: 1 }}>{plan.fiyat}</span>
                    <span style={{ fontSize: 15, color: plan.populer ? 'rgba(255,255,255,0.45)' : '#94a3b8', fontWeight: 500 }}>/ay</span>
                  </div>
                  <p style={{ fontSize: 13, color: plan.populer ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom: 28 }}>
                    {plan.altBaslik}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.ozellikler.map((oz) => (
                      <li key={oz} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: plan.populer ? '#22c55e' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke={plan.populer ? 'white' : '#166534'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span style={{ fontSize: 13, color: plan.populer ? 'rgba(255,255,255,0.8)' : '#475569', fontWeight: 500 }}>{oz}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.aktif ? (
                    <Link href="/isletme/kayit">
                      <button style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 700, background: plan.populer ? 'white' : '#1A2744', color: plan.populer ? '#1A2744' : 'white', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                        Ücretsiz Başla →
                      </button>
                    </Link>
                  ) : (
                    <button disabled style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 600, background: plan.populer ? 'rgba(255,255,255,0.12)' : '#f1f5f9', color: plan.populer ? 'rgba(255,255,255,0.5)' : '#94a3b8', borderRadius: 12, border: plan.populer ? '1px solid rgba(255,255,255,0.15)' : '1.5px solid #e2e8f0', cursor: 'not-allowed' }}>
                      Yakında
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SON CTA ═══ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1A2744 0%, #1e3a6e 100%)',
          paddingTop: 'clamp(80px, 12vw, 120px)',
          paddingBottom: 'clamp(80px, 12vw, 120px)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute pointer-events-none" style={{ top: -80, right: -80, width: 320, height: 320, background: '#3a5fa0', opacity: 0.25, borderRadius: '50%', filter: 'blur(80px)' }} />

        <div className="container-main" style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-reveal="up">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.2rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 680, lineHeight: 1.15 }}>
              İşletmenizi Hemen Platforma Taşıyın
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 44, fontSize: 17, maxWidth: 480, fontWeight: 500, lineHeight: 1.75, margin: '0 auto 44px' }}>
              <strong style={{ color: 'white' }}>3.200+ işletme</strong> dijitale geçti ve müşteri tabanını büyüttü. Sıra sizde.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/isletme/kayit">
                <button style={{ height: 56, padding: '0 44px', fontSize: 16, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  Ücretsiz Kayıt Ol
                </button>
              </Link>
              <Link href="/isletme/giris">
                <button style={{ height: 56, padding: '0 36px', fontSize: 15, fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.75)', borderRadius: 14, border: '2px solid rgba(255,255,255,0.22)', cursor: 'pointer' }}>
                  Giriş Yap
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
