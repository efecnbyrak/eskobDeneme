import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#F97316',
}

export const metadata: Metadata = {
  title: {
    template: '%s | Müşteri Vitrin',
    default: 'Müşteri Vitrin — Dijital Vitrin Platformu',
  },
  description: 'Türkiye\'nin esnaf ve KOBİ\'leri için dijital vitrin platformu. İşletmeni 5 dakikada dijitale taşı.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Müşteri Vitrin',
    title: 'Müşteri Vitrin — Dijital Vitrin Platformu',
    description: 'Türkiye\'nin esnaf ve KOBİ\'leri için dijital vitrin platformu.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased"><Providers>{children}</Providers></body>
    </html>
  )
}
