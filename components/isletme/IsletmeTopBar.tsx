'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const MOBIL_MENU = [
  { href: '/isletme/genel', label: 'Genel', ikon: '📊' },
  { href: '/isletme/randevular', label: 'Randevular', ikon: '📅' },
  { href: '/isletme/hizmetler', label: 'Hizmetler', ikon: '🛠' },
  { href: '/isletme/kampanyalar', label: 'Kampanyalar', ikon: '🏷️' },
  { href: '/isletme/musteriler', label: 'Müşteriler', ikon: '👥' },
  { href: '/isletme/yorumlar', label: 'Yorumlar', ikon: '⭐' },
  { href: '/isletme/istatistikler', label: 'İstatistikler', ikon: '📈' },
  { href: '/isletme/ayarlar/vitrin', label: 'Vitrin Ayarları', ikon: '🏪' },
  { href: '/isletme/ayarlar/saatler', label: 'Çalışma Saatleri', ikon: '🕐' },
  { href: '/isletme/ayarlar/kampanya', label: 'Kampanya Ayarları', ikon: '📣' },
  { href: '/isletme/ayarlar/kategori', label: 'Kategori Ayarları', ikon: '🗂️' },
  { href: '/isletme/ayarlar/bildirimler', label: 'Bildirimler', ikon: '🔔' },
  { href: '/isletme/ayarlar/guvenlik', label: 'Güvenlik & Şifre', ikon: '🔒' },
  { href: '/isletme/ayarlar/hesap', label: 'Hesap Bilgileri', ikon: '👤' },
  { href: '/isletme/ayarlar/plan', label: 'Plan & Abonelik', ikon: '💳' },
]

export function IsletmeTopBar() {
  const [acik, setAcik] = useState(false)
  const [cikisModal, setCikisModal] = useState(false)
  const [cikisYukleniyor, setCikisYukleniyor] = useState(false)
  const pathname = usePathname()

  async function handleCikis() {
    setCikisYukleniyor(true)
    await signOut({ callbackUrl: '/isletme/giris' })
  }

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 h-14 flex items-center justify-between">
        <Link href="/isletme/genel" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">EV</span>
          <span className="font-bold text-white font-display text-sm">İşletme Paneli</span>
        </Link>
        <button
          onClick={() => setAcik(!acik)}
          className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
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

      {/* Mobile Drawer — CSS transform ile smooth slide */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${acik ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${acik ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setAcik(false)}
        />
        <div className={`absolute left-0 top-0 h-full w-72 bg-slate-900 overflow-y-auto transition-transform duration-300 ${acik ? 'translate-x-0' : '-translate-x-full'}`}>
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
                <button
                  onClick={() => { setAcik(false); setCikisModal(true) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400"
                >
                  🚪 Çıkış Yap
                </button>
              </div>
            </nav>
          </div>
        </div>

      {/* Çıkış Onay Modalı */}
      {cikisModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => !cikisYukleniyor && setCikisModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Çıkış Yapmak İstiyor musunuz?</h3>
              <p className="text-sm text-slate-500">İşletme panelinizden çıkış yapılacak.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCikisModal(false)}
                disabled={cikisYukleniyor}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleCikis}
                disabled={cikisYukleniyor}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {cikisYukleniyor ? 'Çıkılıyor...' : 'Evet, Çıkış Yap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
