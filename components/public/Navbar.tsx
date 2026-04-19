import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-bold text-xl text-[var(--color-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Esnaf Vitrin
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/ara" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              Esnaf Ara
            </Link>
            <Link href="/kategori/berber" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              Kategoriler
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/giris">
              <Button variant="ghost" size="sm">Giriş Yap</Button>
            </Link>
            <Link href="/kayit">
              <Button size="sm">Ücretsiz Başla</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
