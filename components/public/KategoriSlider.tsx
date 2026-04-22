'use client'

import Link from 'next/link'
import { useState } from 'react'
import { KATEGORILER } from '@/lib/constants'

export function KategoriSlider() {
  const [genisl, setGenisl] = useState(false)
  const gorsel = genisl ? KATEGORILER : KATEGORILER.slice(0, 6)

  return (
    <>
      {/* Mobil: yatay kaydırmalı tek satır */}
      <div className="lg:hidden">
        <div
          style={{
            display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
            scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          }}
          className="no-scrollbar"
        >
          {KATEGORILER.map((k) => (
            <Link
              key={k.slug}
              href={`/kategori/${k.slug}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minWidth: 90, padding: '16px 12px', gap: 8,
                background: 'white', borderRadius: 16, border: '1px solid var(--color-border)',
                textDecoration: 'none', boxShadow: 'var(--shadow-sm)', flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 26 }}>{k.ikon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                {k.ad}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: tek satır grid + Daha Fazla butonu */}
      <div className="hidden lg:block">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gorsel.length}, 1fr)`, gap: 16 }}>
          {gorsel.map((k) => (
            <Link
              key={k.slug}
              href={`/kategori/${k.slug}`}
              className="group card-elite"
              style={{
                padding: '24px 12px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                minWidth: 0,
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, transition: 'all 0.3s' }} className="group-hover:scale-110">
                <span style={{ fontSize: 24 }}>{k.ikon}</span>
              </div>
              <span
                className="group-hover:text-[var(--color-primary)]"
                style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', transition: 'color 0.2s', lineHeight: 1.3, wordBreak: 'break-word', hyphens: 'auto' as React.CSSProperties['hyphens'], textAlign: 'center' }}
              >
                {k.ad}
              </span>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => setGenisl((p) => !p)}
            style={{
              padding: '10px 28px', fontSize: 14, fontWeight: 600,
              color: 'var(--color-primary)', background: 'transparent',
              border: '1.5px solid var(--color-primary)', borderRadius: 12,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-light)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            {genisl ? 'Daha Az Göster ↑' : `Daha Fazla (${KATEGORILER.length - 6}) →`}
          </button>
        </div>
      </div>
    </>
  )
}
