'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/genel',        label: 'Genel',      icon: '🏠' },
  { href: '/favorilerim',  label: 'Favoriler',  icon: '❤️' },
  { href: '/randevularim', label: 'Randevular', icon: '📅' },
  { href: '/yorumlarim',   label: 'Yorumlar',   icon: '⭐' },
  { href: '/ayarlar',      label: 'Ayarlar',    icon: '⚙️' },
]

export function HesabimMobilNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t safe-bottom"
      style={{ borderColor: '#EBEBEB', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', height: 56 }}>
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                textDecoration: 'none',
                color: active ? 'var(--color-primary)' : '#888',
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                minHeight: 44,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
