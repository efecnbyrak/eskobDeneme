'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/musteri/genel', label: 'Genel Bakış', ikon: '🏠' },
  { href: '/musteri/genel/randevularim', label: 'Randevularım', ikon: '📅' },
  { href: '/musteri/genel/favorilerim', label: 'Favorilerim', ikon: '❤️' },
  { href: '/musteri/genel/yorumlarim', label: 'Yorumlarım', ikon: '⭐' },
  { href: '/musteri/genel/profil', label: 'Profilim', ikon: '👤' },
  { href: '/musteri/genel/ayarlar', label: 'Ayarlar', ikon: '⚙️' },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] min-h-screen bg-white border-r border-[var(--color-border)] flex flex-col shrink-0">
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/musteri" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold font-display shrink-0">
            EV
          </span>
          <span className="font-bold text-[var(--color-primary)] font-display">Esnaf Vitrin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest px-3 mb-2 mt-1">
          Hesabım
        </p>
        <ul className="space-y-0.5">
          {ITEMS.map((item) => {
            const aktif =
              pathname === item.href || (item.href !== '/musteri/genel' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-all',
                    aktif
                      ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]'
                  )}
                >
                  <span className="w-5 text-center">{item.ikon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <Link
          href="/musteri/ara"
          className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] transition-all px-3 py-2.5 rounded-[var(--radius-md)] mb-1"
        >
          <span className="w-5 text-center">🔍</span> Esnaf Keşfet
        </Link>
        <a
          href="/api/auth/signout"
          className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 transition-all px-3 py-2.5 rounded-[var(--radius-md)]"
        >
          <span className="w-5 text-center">🚪</span> Çıkış Yap
        </a>
      </div>
    </aside>
  )
}
