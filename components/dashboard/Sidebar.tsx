'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
  { href: '/panel', label: 'Genel Bakış', ikon: '📊' },
  { href: '/panel/vitrin', label: 'Vitrinim', ikon: '🏪' },
  { href: '/panel/hizmetler', label: 'Hizmetler', ikon: '🛠' },
  { href: '/panel/randevular', label: 'Randevular', ikon: '📅' },
  { href: '/panel/musteriler', label: 'Müşteriler', ikon: '👥' },
  { href: '/panel/yorumlar', label: 'Yorumlar', ikon: '⭐' },
  { href: '/panel/ayarlar', label: 'Ayarlar', ikon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-[var(--color-border)] flex flex-col">
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/" className="font-bold text-lg text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Esnaf Vitrin
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const aktif = pathname === item.href || (item.href !== '/panel' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-colors',
                    aktif
                      ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]'
                  )}
                >
                  <span>{item.ikon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-red-500 transition-colors px-3 py-2"
        >
          <span>🚪</span> Çıkış Yap
        </Link>
      </div>
    </aside>
  )
}
