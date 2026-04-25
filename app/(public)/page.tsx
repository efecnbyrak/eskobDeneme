import Link from 'next/link'
import { auth } from '@/lib/auth'
import { EsnafKart } from '@/components/public/EsnafKart'
import { getCategoriesService } from '@/lib/services/category.service'
import { getCampaignsService } from '@/lib/services/campaign.service'
import { getRecommendationsService, getTopEsnafService } from '@/lib/services/recommendation.service'
import { getRecentlyViewedService } from '@/lib/services/recently-viewed.service'

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
              <Link 
                key={k.slug} 
                href={`/kategori/${k.slug}`} 
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  gap: 12, textDecoration: 'none', minWidth: 84 
                }}
              >
                <div 
                  style={{ 
                    width: 76, height: 76, borderRadius: '50%', border: '2px solid #F0F0F0', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 32, background: 'white', transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(242, 122, 26, 0.15)' 
                  }} 
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#F0F0F0'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  {k.ikon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#333', textAlign: 'center', letterSpacing: '-0.01em' }}>
                  {k.ad}
                </span>
              </Link>
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
              {kampanyalar.map((kampanya: any) => {
                const discount = kampanya.indirimYuzde || 0
                const oldPrice = Number(kampanya.fiyat)
                const newPrice = oldPrice - (oldPrice * discount / 100)
                
                return (
                  <Link 
                    href={`/isletme/${kampanya.esnaf.slug}`}
                    key={`camp-${kampanya.id}`} 
                    style={{ 
                      background: 'white', borderRadius: 16, overflow: 'hidden', 
                      border: '1px solid #EAEAEA', transition: 'box-shadow 0.2s', cursor: 'pointer',
                      textDecoration: 'none', display: 'block'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ height: 160, background: '#F5F5F5', position: 'relative' }}>
                      {kampanya.fotoUrl ? (
                        <img src={kampanya.fotoUrl} alt={kampanya.ad} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EAEAEA', color: '#999' }}>
                          Görsel Yok
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: 12, left: 12, background: '#EF4444', color: 'white', fontWeight: 800, fontSize: 14, padding: '4px 10px', borderRadius: 8 }}>
                        %{discount} İndirim
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {kampanya.ad}
                      </h3>
                      <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{kampanya.esnaf.isletmeAdi}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, color: '#999', textDecoration: 'line-through', fontWeight: 500 }}>
                          {oldPrice.toFixed(2)} TL
                        </span>
                        <span style={{ fontSize: 20, color: 'var(--color-primary)', fontWeight: 800 }}>
                          {newPrice.toFixed(2)} TL
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
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
