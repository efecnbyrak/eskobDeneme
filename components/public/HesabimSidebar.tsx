'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/genel', label: 'Genel Bakış', icon: '🏠' },
  { href: '/favorilerim', label: 'Favorilerim', icon: '❤️' },
  { href: '/randevularim', label: 'Randevularım', icon: '📅' },
  { href: '/yorumlarim', label: 'Yorumlarım', icon: '⭐' },
  { href: '/ayarlar', label: 'Ayarlar', icon: '⚙️' },
]

export function HesabimSidebar() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        background: 'white',
        border: '1px solid #EBEBEB',
        borderRadius: 16,
        padding: '8px 0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 96,
      }}
    >
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #F5F5F5', marginBottom: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Hesabım
        </p>
      </div>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              margin: '2px 8px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? 'var(--color-primary)' : '#444',
              background: active ? 'rgba(247,98,10,0.07)' : 'transparent',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
