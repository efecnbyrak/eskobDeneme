import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { ToastProvider } from '@/components/ui/Toast'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </ToastProvider>
  )
}
