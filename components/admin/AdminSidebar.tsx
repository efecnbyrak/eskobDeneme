'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/phyberk/admin', label: 'Genel Bakış', ikon: '📊' },
  { href: '/phyberk/admin/kullanicilar', label: 'Kullanıcılar', ikon: '👥' },
  { href: '/phyberk/admin/esnaflar', label: 'İşletmeler', ikon: '🏪' },
  { href: '/phyberk/admin/randevular', label: 'Randevular', ikon: '📅' },
  { href: '/phyberk/admin/yorumlar', label: 'Yorumlar', ikon: '⭐' },
  { href: '/phyberk/admin/kategoriler', label: 'Kategoriler', ikon: '🗂' },
]

export function AdminSidebar({ rol }: { rol?: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] min-h-screen bg-[#111827] text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold font-display shrink-0">
            EV
          </span>
          <span className="font-bold font-display">Kontrol Paneli</span>
        </Link>
        {rol && (
          <span
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '3px 10px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 700,
              background: rol === 'SUPER_ADMIN' ? '#F59E0B' : '#6366F1',
              color: 'white',
            }}
          >
            {rol === 'SUPER_ADMIN' ? 'SÜPER ADMIN' : 'ADMIN'}
          </span>
        )}
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {ITEMS.map((item) => {
            const aktif =
              pathname === item.href ||
              (item.href !== '/phyberk/admin' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-all',
                    aktif
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
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

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/giris' })}
          className="flex w-full items-center gap-3 text-sm text-white/70 hover:text-red-300 hover:bg-red-500/10 transition-all px-3 py-2.5 rounded-[var(--radius-md)]"
        >
          <span className="w-5 text-center">🚪</span> Hesaptan Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
