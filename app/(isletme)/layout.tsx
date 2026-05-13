import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { IsletmeSidebar } from '@/components/isletme/IsletmeSidebar'
import { IsletmeTopBar } from '@/components/isletme/IsletmeTopBar'
import { ToastProvider } from '@/components/ui/Toast'
import { HosgeldinToast } from '@/components/ui/HosgeldinToast'

export default async function IsletmeLayout({ children }: { children: React.ReactNode }) {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const rol = oturum.user.rol
  if (rol === 'USER') redirect('/hesabim')
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') redirect('/phyberk/admin')

  return (
    <ToastProvider>
      <HosgeldinToast />
      <div className="flex min-h-screen bg-slate-100">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <IsletmeSidebar />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile TopBar */}
          <IsletmeTopBar />

          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
