import Link from 'next/link'
import { auth } from '@/lib/auth'
import { EsnafKart } from '@/components/public/EsnafKart'
import { getCategoriesService } from '@/lib/services/category.service'
import { getCampaignsService } from '@/lib/services/campaign.service'
import { getRecommendationsService, getTopEsnafService } from '@/lib/services/recommendation.service'
import { getRecentlyViewedService } from '@/lib/services/recently-viewed.service'
import { CategoryItem } from '@/components/public/CategoryItem'
import { CampaignCard } from '@/components/public/CampaignCard'

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
      
      {/* 1. KATEGORİLER (Trendyol Style Circular Items) */}
      <section style={{ background: 'white', padding: '32px 0 24px', borderBottom: '1px solid #EAEAEA' }}>
        <div className="container-main">
          <div style={{ display: 'flex', gap: 28, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 12 }}>
            {kategoriler.map((k) => (
              <CategoryItem key={k.slug} slug={k.slug} ikon={k.ikon} ad={k.ad} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SANA ÖZEL (Only for logged in users) */}
      {authenticated && recommendations.length > 0 && (
        <section style={{ padding: '32px 0 0' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
                Sana Özel Hizmetler <span style={{ fontSize: 24 }}>✨</span>
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

      {/* 3. CAMPAIGNS / DISCOUNT SECTION */}
      {kampanyalar.length > 0 && (
        <section style={{ padding: '32px 0 0' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333' }}>
                Fırsatları Kaçırma <span style={{ color: '#EF4444', marginLeft: 4 }}>% İndirim</span>
              </h2>
              <Link href="/ara?kampanyali=true" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                Tüm Fırsatlar {'>'}
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

      {/* 4. GENEL LİSTE / ÖNE ÇIKANLAR */}
      <section style={{ padding: '32px 0 64px' }}>
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333' }}>En Çok Tercih Edilenler</h2>
            <Link href="/ara" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Tümünü Gör {'>'}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {topEsnaf.map((e: any) => (
              <EsnafKart key={`top-${e.id}`} esnaf={e} authenticated={authenticated} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PREVIOUSLY VIEWED (If logged in) */}
      {authenticated && recentlyViewed.length > 0 && (
        <section style={{ padding: '0 0 64px' }}>
          <div className="container-main">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 20 }}>Son Gezdiklerin</h2>
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
