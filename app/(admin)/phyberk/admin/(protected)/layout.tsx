import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ToastProvider } from '@/components/ui/Toast'

export default async function AdminKorunanLayout({ children }: { children: React.ReactNode }) {
  const oturum = await auth()
  if (!oturum?.user) redirect('/phyberk/admin')

  const rol = oturum.user.rol
  if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
    if (rol === 'BUSINESS') redirect('/isletme/panel')
    redirect('/hesabim')
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[var(--color-bg)]">
        <div className="hidden lg:flex">
          <AdminSidebar rol={rol} />
        </div>
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="lg:hidden sticky top-0 z-30 bg-[#111827] text-white px-4 h-14 flex items-center justify-between">
            <span className="font-bold font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                A
              </span>
              Admin Panel
            </span>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">{children}</div>
        </div>
      </div>
    </ToastProvider>
  )
}
