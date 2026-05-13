'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MOBIL_MENU = [
  { href: '/isletme/genel', label: 'Genel', ikon: '📊' },
  { href: '/isletme/randevular', label: 'Randevular', ikon: '📅' },
  { href: '/isletme/hizmetler', label: 'Hizmetler', ikon: '🛠' },
  { href: '/isletme/kampanyalar', label: 'Kampanyalar', ikon: '🏷️' },
  { href: '/isletme/musteriler', label: 'Müşteriler', ikon: '👥' },
  { href: '/isletme/yorumlar', label: 'Yorumlar', ikon: '⭐' },
  { href: '/isletme/istatistikler', label: 'İstatistikler', ikon: '📈' },
  { href: '/isletme/ayarlar/vitrin', label: 'Vitrin Ayarları', ikon: '🏪' },
  { href: '/isletme/ayarlar/kampanya', label: 'Kampanya Ayarları', ikon: '📣' },
  { href: '/isletme/ayarlar/kategori', label: 'Kategori Ayarları', ikon: '🗂️' },
  { href: '/isletme/ayarlar/bildirimler', label: 'Bildirimler', ikon: '🔔' },
  { href: '/isletme/ayarlar/plan', label: 'Plan & Abonelik', ikon: '💳' },
]

export function IsletmeTopBar() {
  const [acik, setAcik] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 h-14 flex items-center justify-between">
        <Link href="/isletme/genel" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">EV</span>
          <span className="font-bold text-white font-display text-sm">İşletme Paneli</span>
        </Link>
        <button
          onClick={() => setAcik(!acik)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300"
          aria-label="Menü"
        >
          {acik ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {acik && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAcik(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-900 overflow-y-auto">
            <div className="p-4 border-b border-slate-800">
              <span className="font-bold text-white font-display text-sm">Esnaf Vitrin — İşletme</span>
            </div>
            <nav className="p-3">
              <ul className="space-y-0.5">
                {MOBIL_MENU.map((item) => {
                  const aktif = item.href === '/isletme/genel'
                    ? pathname === '/isletme/genel' || pathname === '/isletme'
                    : pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setAcik(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          aktif ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        <span>{item.ikon}</span>
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="border-t border-slate-800 mt-4 pt-4 space-y-0.5">
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100">
                  🌐 Müşteri Sitesi
                </a>
                <a href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400">
                  🚪 Çıkış Yap
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
