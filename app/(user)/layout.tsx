import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { UserSidebar } from '@/components/user/UserSidebar'
import { ToastProvider } from '@/components/ui/Toast'
import { HosgeldinToast } from '@/components/ui/HosgeldinToast'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const oturum = await auth()
  if (!oturum?.user) redirect('/musteri/giris')

  const rol = oturum.user.rol
  if (rol === 'BUSINESS') redirect('/isletme/panel')
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') redirect('/phyberk/admin')

  return (
    <ToastProvider>
      <HosgeldinToast />
      <div className="flex min-h-screen bg-[var(--color-bg)]">
        <div className="hidden lg:flex">
          <UserSidebar />
        </div>
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[var(--color-border)] px-4 h-14 flex items-center justify-between">
            <span className="font-bold text-[var(--color-primary)] font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                EV
              </span>
              Hesabım
            </span>
            <nav className="flex items-center gap-1">
              <a
                href="/musteri/genel/randevularim"
                className="p-2 rounded-lg hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
                title="Randevular"
              >
                📅
              </a>
              <a
                href="/musteri/genel/favorilerim"
                className="p-2 rounded-lg hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
                title="Favoriler"
              >
                ❤️
              </a>
              <a
                href="/musteri/genel/yorumlarim"
                className="p-2 rounded-lg hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
                title="Yorumlarım"
              >
                ⭐
              </a>
              <a
                href="/musteri/genel/ayarlar"
                className="p-2 rounded-lg hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
                title="Ayarlar"
              >
                ⚙️
              </a>
            </nav>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">{children}</div>
        </div>
      </div>
    </ToastProvider>
  )
}
