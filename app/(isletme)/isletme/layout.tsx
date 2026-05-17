import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { IsletmeSidebar } from '@/components/isletme/IsletmeSidebar'
import { IsletmeTopBar } from '@/components/isletme/IsletmeTopBar'
import { ToastProvider } from '@/components/ui/Toast'
import { HosgeldinToast } from '@/components/ui/HosgeldinToast'
import { Footer } from '@/components/ui/Footer'

export default async function IsletmeLayout({ children }: { children: React.ReactNode }) {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const rol = oturum.user.rol
  if (rol === 'USER') redirect('/hesabim')
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') redirect('/phyberk/admin')

  return (
    <ToastProvider>
      <HosgeldinToast />
      <div className="min-h-screen bg-slate-100">
        {/* Sabit Sidebar — sadece desktop */}
        <div className="hidden lg:block fixed top-0 left-0 h-screen z-20">
          <IsletmeSidebar />
        </div>

        {/* İçerik — sidebar genişliği kadar sol boşluk */}
        <div className="lg:pl-[248px] flex flex-col min-h-screen">
          <IsletmeTopBar />

          <main className="flex-1">
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 lg:py-8">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
