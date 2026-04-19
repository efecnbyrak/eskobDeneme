'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { KATEGORILER } from '@/lib/constants'

export function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [kategoriAcik, setKategoriAcik] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl text-[var(--color-primary)] font-display flex items-center gap-2 shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">EV</span>
            <span className="hidden sm:inline">Esnaf Vitrin</span>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden lg:flex items-center gap-2 ml-10">
            <Link
              href="/ara"
              className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors px-4 py-2.5 rounded-md hover:bg-[var(--color-bg-muted)]"
            >
              Esnaf Ara
            </Link>

            {/* Kategoriler dropdown */}
            <div className="relative">
              <button
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 px-4 py-2.5 rounded-md hover:bg-[var(--color-bg-muted)]"
                onMouseEnter={() => setKategoriAcik(true)}
                onMouseLeave={() => setKategoriAcik(false)}
              >
                Kategoriler
                <svg className={`w-3.5 h-3.5 transition-transform ${kategoriAcik ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {kategoriAcik && (
                <div
                  className="absolute top-full left-0 mt-0.5 w-64 bg-white border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-lg)] py-2 animate-fade-in"
                  onMouseEnter={() => setKategoriAcik(true)}
                  onMouseLeave={() => setKategoriAcik(false)}
                >
                  {KATEGORILER.map((k) => (
                    <Link
                      key={k.slug}
                      href={`/kategori/${k.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] transition-colors"
                    >
                      <span className="text-lg">{k.ikon}</span>
                      {k.ad}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/giris" className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors px-3 py-2">
              Giriş Yap
            </Link>
            <Link href="/kayit">
              <Button size="sm" className="font-semibold px-5">Ücretsiz Başla</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-[var(--color-bg-muted)] transition-colors"
            onClick={() => setMenuAcik((p) => !p)}
            aria-label="Menü"
          >
            {menuAcik ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuAcik && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-white animate-fade-in">
          <div className="container-main py-4 space-y-1">
            <Link
              href="/ara"
              className="block px-3 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] rounded-lg transition-colors"
              onClick={() => setMenuAcik(false)}
            >
              🔍 Esnaf Ara
            </Link>
            <div className="px-3 pt-3 pb-1 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Kategoriler
            </div>
            <div className="grid grid-cols-2 gap-1">
              {KATEGORILER.slice(0, 8).map((k) => (
                <Link
                  key={k.slug}
                  href={`/kategori/${k.slug}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] rounded-lg transition-colors"
                  onClick={() => setMenuAcik(false)}
                >
                  <span>{k.ikon}</span> {k.ad}
                </Link>
              ))}
            </div>
            <div className="pt-3 mt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
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
