'use client'

import Link from 'next/link'

interface QuickActionCardProps {
  href: string
  ikon: string
  baslik: string
  aciklama: string
  renk: string
}

export function QuickActionCard({ href, ikon, baslik, aciklama, renk }: QuickActionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: '20px',
          borderRadius: 14,
          border: '1.5px solid var(--color-border)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: 'var(--color-bg)',
        }}
        onMouseEnter={(el) => { 
          (el.currentTarget as HTMLElement).style.borderColor = renk; 
          (el.currentTarget as HTMLElement).style.background = 'white' 
        }}
        onMouseLeave={(el) => { 
          (el.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; 
          (el.currentTarget as HTMLElement).style.background = 'var(--color-bg)' 
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>{ikon}</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>{baslik}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{aciklama}</div>
      </div>
    </Link>
  )
}
