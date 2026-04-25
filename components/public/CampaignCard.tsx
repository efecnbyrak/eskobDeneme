'use client'

import Link from 'next/link'

interface CampaignCardProps {
  kampanya: any
}

export function CampaignCard({ kampanya }: CampaignCardProps) {
  const discount = kampanya.indirimYuzde || 0
  const oldPrice = Number(kampanya.fiyat)
  const newPrice = oldPrice - (oldPrice * discount / 100)
  
  return (
    <Link 
      href={`/isletme/${kampanya.esnaf.slug}`}
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
}
