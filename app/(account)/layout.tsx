import { ReactNode } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { BackToTop } from '@/components/public/BackToTop'
import { HesabimSidebar } from '@/components/public/HesabimSidebar'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 80, paddingBottom: 80, minHeight: '70vh' }}>
        <div
          className="container-main"
          style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}
        >
          <aside style={{ width: 210, flexShrink: 0 }}>
            <HesabimSidebar />
          </aside>
          <div style={{ flex: 1, minWidth: 0 }}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </ToastProvider>
  )
}
