import { ReactNode } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { BackToTop } from '@/components/public/BackToTop'
import { HesabimSidebar } from '@/components/public/HesabimSidebar'
import { HesabimMobilNav } from '@/components/public/HesabimMobilNav'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      {/* Mobilde bottom nav için alt padding */}
      <main style={{ flex: 1, paddingTop: 80, paddingBottom: 80, minHeight: '70vh' }} className="pb-24 md:pb-20">
        <div
          className="container-main"
          style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}
        >
          {/* Sidebar — sadece md ve üstü */}
          <aside className="hidden md:block" style={{ width: 210, flexShrink: 0 }}>
            <HesabimSidebar />
          </aside>
          <div style={{ flex: 1, minWidth: 0 }}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobil alt navigasyon */}
      <HesabimMobilNav />

      <div className="hidden md:block">
        <Footer />
      </div>
      <BackToTop />
    </ToastProvider>
  )
}
