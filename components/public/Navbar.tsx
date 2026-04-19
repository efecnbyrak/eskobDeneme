'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { KATEGORILER } from '@/lib/constants'

export function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [kategoriAcik, setKategoriAcik] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-border)',
      transition: 'all 0.3s',
    }}>
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '18px', color: 'var(--color-primary)', textDecoration: 'none', flexShrink: 0 }} className="font-display">
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>EV</span>
            <span className="hidden sm:inline">Esnaf Vitrin</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '4px', marginLeft: '40px' }}>
            <Link href="/ara" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', padding: '10px 16px', borderRadius: '12px', transition: 'all 0.2s', textDecoration: 'none' }}>
              Esnaf Ara
            </Link>

            {/* Kategoriler dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => setKategoriAcik(true)}
                onMouseLeave={() => setKategoriAcik(false)}
              >
                Kategoriler
                <svg style={{ width: 14, height: 14, transition: 'transform 0.2s', transform: kategoriAcik ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {kategoriAcik && (
                <div
                  className="animate-fade-in"
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', width: '260px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', padding: '8px 0' }}
                  onMouseEnter={() => setKategoriAcik(true)}
                  onMouseLeave={() => setKategoriAcik(false)}
                >
                  {KATEGORILER.map((k) => (
                    <Link key={k.slug} href={`/kategori/${k.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', fontSize: '14px', color: 'var(--color-text)', transition: 'background 0.15s', textDecoration: 'none' }}>
                      <span style={{ fontSize: '18px' }}>{k.ikon}</span>
                      {k.ad}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Desktop CTA */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '16px' }}>
            <Link href="/giris" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', padding: '10px 16px', textDecoration: 'none' }}>
              Giriş Yap
            </Link>
            <Link href="/kayit">
              <Button size="sm">Ücretsiz Başla</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            style={{ padding: '12px', marginRight: '-8px', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMenuAcik((p) => !p)}
            aria-label="Menü"
          >
            {menuAcik ? (
              <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuAcik && (
        <div className="lg:hidden animate-fade-in" style={{ borderTop: '1px solid var(--color-border)', background: 'white' }}>
          <div className="container-main" style={{ padding: '24px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/ara" style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', color: 'var(--color-text)' }} onClick={() => setMenuAcik(false)}>
                🔍 Esnaf Ara
              </Link>
              
              <div style={{ padding: '16px 16px 8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                Kategoriler
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {KATEGORILER.slice(0, 8).map((k) => (
                  <Link key={k.slug} href={`/kategori/${k.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', fontSize: '14px', borderRadius: '12px', textDecoration: 'none', color: 'var(--color-text)' }} onClick={() => setMenuAcik(false)}>
                    <span>{k.ikon}</span> {k.ad}
                  </Link>
                ))}
              </div>
              
              <div style={{ paddingTop: '20px', marginTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/giris" onClick={() => setMenuAcik(false)}>
                  <Button variant="secondary" size="sm" className="w-full">Giriş Yap</Button>
                </Link>
                <Link href="/kayit" onClick={() => setMenuAcik(false)}>
                  <Button size="sm" className="w-full">Ücretsiz Başla</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
