'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
  { href: '/hesabim/genel', label: 'Genel Bakış', ikon: '🏠', exact: true },
  { href: '/hesabim/genel/randevularim', label: 'Randevularım', ikon: '📅', exact: false },
  { href: '/hesabim/genel/favorilerim', label: 'Favorilerim', ikon: '❤️', exact: false },
  { href: '/hesabim/genel/yorumlarim', label: 'Yorumlarım', ikon: '⭐', exact: false },
  { href: '/hesabim/genel/profil', label: 'Profilim', ikon: '👤', exact: false },
  { href: '/hesabim/genel/ayarlar', label: 'Ayarlar', ikon: '⚙️', exact: false },
]

function CikisModal({ onOnayla, onIptal }: { onOnayla: () => void; onIptal: () => void }) {
  return (
    <div
      onClick={onIptal}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, padding: '36px 32px',
          maxWidth: 360, width: '90%', textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
          Çıkış yapmak istiyor musunuz?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Hesabınızdan çıkış yaptığınızda tekrar giriş yapmanız gerekecek.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onIptal}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: '1.5px solid var(--color-border)',
              background: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            İptal
          </button>
          <button
            onClick={onOnayla}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none',
              background: '#EF4444', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Evet, Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}

export function UserSidebar() {
  const pathname = usePathname()
  const [cikisModal, setCikisModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const items = MENU_ITEMS

  useEffect(() => setMounted(true), [])

  return (
    <>
      {mounted && cikisModal && createPortal(
        <CikisModal
          onOnayla={() => signOut({ callbackUrl: '/giris' })}
          onIptal={() => setCikisModal(false)}
        />,
        document.body
      )}
      <aside className="w-[260px] min-h-screen bg-white border-r border-[var(--color-border)] flex flex-col shrink-0">
        <div className="p-5 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-2.5">
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
            {items.map((item) => {
              const aktif =
                pathname === item.href || (!item.exact && pathname.startsWith(item.href))
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
            href="/ara"
            className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] transition-all px-3 py-2.5 rounded-[var(--radius-md)] mb-1"
          >
            <span className="w-5 text-center">🔍</span> Esnaf Keşfet
          </Link>
          <button
            onClick={() => setCikisModal(true)}
            className="flex w-full items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 transition-all px-3 py-2.5 rounded-[var(--radius-md)]"
          >
            <span className="w-5 text-center">🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  )
}
