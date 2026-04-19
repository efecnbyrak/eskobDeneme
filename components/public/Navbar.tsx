'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { KATEGORILER } from '@/lib/constants'

export function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [kategoriAcik, setKategoriAcik] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl text-[var(--color-primary)] font-display flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">EV</span>
            Esnaf Vitrin
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/ara"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              Esnaf Ara
            </Link>

            {/* Kategoriler dropdown */}
            <div className="relative">
              <button
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors flex items-center gap-1"
                onMouseEnter={() => setKategoriAcik(true)}
                onMouseLeave={() => setKategoriAcik(false)}
              >
                Kategoriler
                <svg className={`w-3 h-3 transition-transform ${kategoriAcik ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {kategoriAcik && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] py-2 grid grid-cols-2 gap-0.5 animate-fade-in"
                  onMouseEnter={() => setKategoriAcik(true)}
                  onMouseLeave={() => setKategoriAcik(false)}
                >
                  {KATEGORILER.slice(0, 10).map((k) => (
                    <Link
                      key={k.slug}
                      href={`/kategori/${k.slug}`}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)] transition-colors rounded-md mx-1"
                    >
                      <span>{k.ikon}</span>
                      {k.ad}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/giris">
              <Button variant="ghost" size="sm">Giriş Yap</Button>
            </Link>
            <Link href="/kayit">
              <Button size="sm">Ücretsiz Başla</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg-muted)] transition-colors"
            onClick={() => setMenuAcik((p) => !p)}
            aria-label="Menü"
          >
            {menuAcik ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuAcik && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/ara"
              className="block px-3 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] rounded-lg transition-colors"
              onClick={() => setMenuAcik(false)}
            >
              Esnaf Ara
            </Link>
            <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Kategoriler
            </div>
            <div className="grid grid-cols-2 gap-1">
              {KATEGORILER.slice(0, 8).map((k) => (
                <Link
                  key={k.slug}
                  href={`/kategori/${k.slug}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] rounded-lg transition-colors"
                  onClick={() => setMenuAcik(false)}
                >
                  <span>{k.ikon}</span> {k.ad}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
              <Link href="/giris" onClick={() => setMenuAcik(false)}>
                <Button variant="secondary" size="sm" className="w-full">Giriş Yap</Button>
              </Link>
              <Link href="/kayit" onClick={() => setMenuAcik(false)}>
                <Button size="sm" className="w-full">Ücretsiz Başla</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
