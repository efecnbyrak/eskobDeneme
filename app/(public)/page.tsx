import Link from 'next/link'
import { auth } from '@/lib/auth'
import { EsnafKart } from '@/components/public/EsnafKart'
import { getCategoriesService } from '@/lib/services/category.service'
import { getCampaignsService } from '@/lib/services/campaign.service'
import { getRecommendationsService, getTopEsnafService } from '@/lib/services/recommendation.service'
import { getRecentlyViewedService } from '@/lib/services/recently-viewed.service'
import { CategoryItem } from '@/components/public/CategoryItem'
import { CampaignCard } from '@/components/public/CampaignCard'
import { HeroArama } from '@/components/public/HeroArama'

export default async function AnaSayfa() {
  const session = await auth()
  const userId = session?.user?.id
  const authenticated = !!userId

  const [
    kategoriler,
    kampanyalar,
    recommendations,
    recentlyViewed,
    topEsnaf
  ] = await Promise.all([
    getCategoriesService(),
    getCampaignsService({ limit: 8 }),
    getRecommendationsService(userId, { limit: 8 }),
    getRecentlyViewedService(userId || '', { limit: 10 }),
    getTopEsnafService({ limit: 8 })
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F5F6F8' }}>

      {/* HERO — arama çubuğu + başlık */}
      <section style={{
        background: 'linear-gradient(135deg, #F7620A 0%, #F7931E 60%, #FFB347 100%)',
        padding: '52px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dekoratif arka plan şekli */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="container-main" style={{ position: 'relative', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(26px, 4.5vw, 46px)',
            fontWeight: 800,
            color: 'white',
            marginBottom: 10,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            Yakınındaki İşletmeleri Keşfet
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.88)',
            marginBottom: 36,
            fontWeight: 500,
          }}>
            Berber, kafe, kuaför ve daha fazlası — randevu al, keşfet.
          </p>
          <HeroArama />

          {/* Popüler aramalar */}
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
        </div>
      </section>

      {/* KATEGORİLER */}
      <section style={{ background: 'white', padding: '32px 0 24px' }}>
        <div className="container-main">
          <div style={{ display: 'flex', gap: 28, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8 }}>
            {kategoriler.map((k) => (
              <CategoryItem key={k.slug} slug={k.slug} ikon={k.ikon} ad={k.ad} ikonUrl={(k as any).ikonUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* SANA ÖZEL */}
      {authenticated && recommendations.length > 0 && (
        <section style={{ padding: '36px 0 0' }}>
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

      {/* KAMPANYALAR */}
      {kampanyalar.length > 0 && (
        <section style={{ padding: '36px 0 0' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>
                Fırsatları Kaçırma <span style={{ color: '#EF4444', marginLeft: 4 }}>% İndirim</span>
              </h2>
              <Link href="/ara?kampanyali=true" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                Tüm Fırsatlar →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {kampanyalar.map((kampanya: any) => (
                <CampaignCard key={`camp-${kampanya.id}`} kampanya={kampanya} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EN ÇOK TERCİH EDİLENLER */}
      <section style={{ padding: '36px 0 64px' }}>
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
        <section style={{ padding: '0 0 64px' }}>
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

    </div>
  )
}
