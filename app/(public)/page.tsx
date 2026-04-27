import Link from 'next/link'
import { auth } from '@/lib/auth'
import { EsnafKart } from '@/components/public/EsnafKart'
import { getCategoriesService } from '@/lib/services/category.service'
import { getCampaignsService } from '@/lib/services/campaign.service'
import { getRecommendationsService, getTopEsnafService } from '@/lib/services/recommendation.service'
import { getRecentlyViewedService } from '@/lib/services/recently-viewed.service'
import { CampaignCard } from '@/components/public/CampaignCard'

// Yöneticiden yüklenecek promosyon görsellerinin placeholder versiyonları
const PROMO_BANNERLAR = [
  { emoji: '✂️', title: 'Berber & Kuaför', subtitle: '%30\'a varan indirim' },
  { emoji: '🍕', title: 'Yeme & İçme', subtitle: 'Özel menüler' },
  { emoji: '💆', title: 'Spa & Masaj', subtitle: 'Haftasonu fırsatı' },
  { emoji: '🔧', title: 'Teknik Servis', subtitle: 'Ücretsiz keşif' },
  { emoji: '🎓', title: 'Eğitim & Kurs', subtitle: 'İlk ders bedava' },
  { emoji: '🏋️', title: 'Spor & Fitness', subtitle: 'Aylık üyelik' },
  { emoji: '🐾', title: 'Evcil Hayvan', subtitle: 'Tımar hizmetleri' },
  { emoji: '🎨', title: 'Güzellik & Estetik', subtitle: 'Trend tasarımlar' },
]

const NEDEN_BIZ = [
  { icon: '🏪', title: '5.000+', sub: 'Kayıtlı İşletme' },
  { icon: '📅', title: '100.000+', sub: 'Alınan Randevu' },
  { icon: '⭐', title: '4.8/5', sub: 'Ortalama Puan' },
  { icon: '🌆', title: '81', sub: 'İlde Hizmet' },
]

export default async function AnaSayfa() {
  const session = await auth()
  const userId = session?.user?.id
  const authenticated = !!userId

  const [
    kampanyalar,
    recommendations,
    recentlyViewed,
    topEsnaf
  ] = await Promise.all([
    getCampaignsService({ limit: 8 }),
    getRecommendationsService(userId, { limit: 8 }),
    getRecentlyViewedService(userId || '', { limit: 10 }),
    getTopEsnafService({ limit: 8 })
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F5F6F8' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #F7620A 0%, #F7931E 60%, #FFB347 100%)',
        padding: authenticated ? '52px 0 56px' : '72px 0 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="container-main" style={{ position: 'relative', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(26px, 4.5vw, 48px)',
            fontWeight: 800,
            color: 'white',
            marginBottom: 12,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            {authenticated ? 'Yakınındaki İşletmeleri Keşfet' : 'Türkiye\'nin En Büyük Esnaf Platformu'}
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.88)',
            marginBottom: authenticated ? 0 : 40,
            fontWeight: 500,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            {authenticated
              ? 'Berber, kafe, kuaför ve daha fazlası — randevu al, keşfet.'
              : 'Binlerce işletme, tek platformda. Randevu al, hizmet keşfet, en iyi esnafı bul.'}
          </p>

          {/* Misafir kullanıcı CTA */}
          {!authenticated && (
            <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link
                href="/ara"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'white', color: 'var(--color-primary)',
                  fontWeight: 700, fontSize: 15,
                  padding: '14px 32px', borderRadius: 14,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                🔍 Hemen Keşfet
              </Link>
              <Link
                href="/isletme/kayit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.6)',
                  color: 'white',
                  fontWeight: 700, fontSize: 15,
                  padding: '14px 32px', borderRadius: 14,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.2s',
                }}
              >
                🏪 İşletmeni Kayıt Et
              </Link>
            </div>
          )}

          {/* Giriş yapmış kullanıcı için popüler aramalar */}
          {authenticated && (
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Popüler:</span>
              {['Berber', 'Kafe', 'Kuaför', 'Restoran', 'Oto Servis'].map((tag) => (
                <Link
                  key={tag}
                  href={`/ara?arama=${encodeURIComponent(tag)}`}
                  style={{
                    fontSize: 13, fontWeight: 600, color: 'white',
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '5px 14px', borderRadius: 999,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROMO BANNERLAR — yönetici panelinden yüklenecek (şimdilik placeholder) */}
      <section style={{ background: 'white', padding: '28px 0 24px', position: 'relative', zIndex: 1 }}>
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>Kampanyalar</h2>
            <Link href="/ara?kampanyali=true" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Tümünü Gör →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {PROMO_BANNERLAR.map((banner, i) => (
              <Link
                key={i}
                href="/ara?kampanyali=true"
                style={{
                  minWidth: 150, width: 150, height: 150, borderRadius: 16,
                  background: 'white',
                  border: '1px solid #EBEBEB',
                  flexShrink: 0, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="hover:-translate-y-1 hover:shadow-md"
              >
                <span style={{ fontSize: 36 }}>{banner.emoji}</span>
                <div style={{ textAlign: 'center', padding: '0 10px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#222', marginBottom: 2 }}>{banner.title}</p>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#999' }}>{banner.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SANA ÖZEL */}
      {authenticated && recommendations.length > 0 && (
        <section style={{ padding: '36px 0 0', position: 'relative', zIndex: 1 }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#222', display: 'flex', alignItems: 'center', gap: 8 }}>
                Sana Özel Hizmetler <span style={{ fontSize: 22 }}>✨</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {recommendations.map((e: any) => (
                <EsnafKart key={`rec-${e.id}`} esnaf={e} authenticated={authenticated} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEDEN ESNAF VİTRİN — güven & istatistik */}
      <section style={{
        padding: '52px 0',
        background: 'linear-gradient(135deg, #FFF8F5 0%, #F0F4FF 100%)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 10 }}>
              Neden Müşteri Vitrin?
            </h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
              Türkiye genelinde binlerce işletme ve müşteri bir arada buluşuyor
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {NEDEN_BIZ.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center', padding: '32px 20px',
                  background: 'white', borderRadius: 20,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  border: '1px solid #F0F0F0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="hover:-translate-y-1 hover:shadow-xl"
              >
                <div style={{ fontSize: 38, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: '#555', fontWeight: 600 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Özellikler */}
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { icon: '📍', title: 'Konuma Göre Keşfet', desc: 'Yakınındaki işletmeleri saniyeler içinde bul, mesafeye göre filtrele.' },
              { icon: '📅', title: 'Anında Randevu Al', desc: 'Müsait saatleri gör, tek tıkla rezervasyon yap, hatırlatıcı al.' },
              { icon: '💬', title: 'Gerçek Yorumlar', desc: 'Onaylı müşteri yorumları ile güvenilir işletmeleri seç.' },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', gap: 16, padding: '20px 24px',
                  background: 'white', borderRadius: 16,
                  border: '1px solid #EAEAEA',
                }}
              >
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#222', marginBottom: 6 }}>{f.title}</p>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KAMPANYALAR */}
      {kampanyalar.length > 0 && (
        <section style={{ padding: '40px 0 0', position: 'relative', zIndex: 2 }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>
                Fırsatları Kaçırma <span style={{ color: '#EF4444', marginLeft: 4 }}>% İndirim</span>
              </h2>
              <Link href="/ara?kampanyali=true" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                Tüm Fırsatlar →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, overflow: 'visible' }}>
              {kampanyalar.map((kampanya: any) => (
                <CampaignCard key={`camp-${kampanya.id}`} kampanya={kampanya} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EN ÇOK TERCİH EDİLENLER */}
      <section style={{ padding: '40px 0 64px', position: 'relative', zIndex: 2 }}>
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>En Çok Tercih Edilenler</h2>
            <Link href="/ara" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Tümünü Gör →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {topEsnaf.map((e: any) => (
              <EsnafKart key={`top-${e.id}`} esnaf={e} authenticated={authenticated} />
            ))}
          </div>
        </div>
      </section>

      {/* SON GEZİLENLER */}
      {authenticated && recentlyViewed.length > 0 && (
        <section style={{ padding: '0 0 64px', position: 'relative', zIndex: 2 }}>
          <div className="container-main">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#222', marginBottom: 20 }}>Son Gezdiklerin</h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 16 }}>
              {recentlyViewed.map((e: any) => (
                <div key={`history-${e.id}`} style={{ minWidth: 260, flexShrink: 0 }}>
                  <EsnafKart esnaf={e} authenticated={authenticated} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GİRİŞ YAPMAMIŞ KULLANICI — alt CTA */}
      {!authenticated && (
        <section style={{
          padding: '64px 0',
          background: 'linear-gradient(135deg, #1A2744 0%, #2D4A8A 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div className="container-main" style={{ textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 14 }}>
              Hemen Ücretsiz Başla
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
              Hesap oluştur, favori işletmelerini kaydet ve randevunu kolayca yönet.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link
                href="/musteri/kayit"
                style={{
                  background: 'var(--color-primary)', color: 'white',
                  fontWeight: 700, fontSize: 15,
                  padding: '14px 36px', borderRadius: 14,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(247,98,10,0.4)',
                }}
              >
                Ücretsiz Hesap Oluştur
              </Link>
              <Link
                href="/giris"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  fontWeight: 600, fontSize: 15,
                  padding: '14px 36px', borderRadius: 14,
                  textDecoration: 'none',
                }}
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
