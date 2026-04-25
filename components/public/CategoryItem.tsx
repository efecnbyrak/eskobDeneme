'use client'

import Link from 'next/link'

interface CategoryItemProps {
  slug: string
  ikon: string
  ad: string
}

export function CategoryItem({ slug, ikon, ad }: CategoryItemProps) {
  return (
    <Link 
      href={`/kategori/${slug}`} 
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
        {ikon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#333', textAlign: 'center', letterSpacing: '-0.01em' }}>
        {ad}
      </span>
    </Link>
  )
}
