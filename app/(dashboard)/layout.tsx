import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ToastProvider } from '@/components/ui/Toast'
import { HosgeldinToast } from '@/components/ui/HosgeldinToast'
import { Footer } from '@/components/ui/Footer'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const rol = oturum.user.rol
  if (rol === 'USER') redirect('/musteri')
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') redirect('/phyberk/admin')

  return (
    <ToastProvider>
      <HosgeldinToast />
      <div className="flex min-h-screen bg-[var(--color-bg)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        <div className="flex-1 min-w-0 overflow-auto flex flex-col">
          {/* Mobile TopBar */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[var(--color-border)] px-4 h-14 flex items-center justify-between">
            <span className="font-bold text-indigo-600 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">EV</span>
              Esnaf Vitrin
            </span>
            {/* Mobile menu nav links */}
            <nav className="flex items-center gap-1">
              <a href="/isletme/panel" className="p-2 rounded-lg hover:bg-indigo-50 transition-colors text-[var(--color-text-secondary)]" title="Genel Bakış">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </a>
              <a href="/isletme/panel/randevular" className="p-2 rounded-lg hover:bg-indigo-50 transition-colors text-[var(--color-text-secondary)]" title="Randevular">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="/isletme/panel/ayarlar" className="p-2 rounded-lg hover:bg-indigo-50 transition-colors text-[var(--color-text-secondary)]" title="Ayarlar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
            </nav>
          </div>

          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 lg:py-8 flex-1 flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}
