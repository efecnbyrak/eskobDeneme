'use client'

import Link from 'next/link'
import { KATEGORILER } from '@/lib/constants'

export function KategoriSlider() {
  const gorsel = KATEGORILER.slice(0, 6)

  return (
    <>
      {/* Mobil: yatay kaydırmalı */}
      <div className="lg:hidden">
        <div
          style={{
            display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12,
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
                minWidth: 96, padding: '18px 12px', gap: 10,
                background: `${k.renk}18`,
                border: `1.5px solid ${k.renk}40`,
                borderRadius: 20, textDecoration: 'none', flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${k.renk}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                {k.ikon}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: 'var(--color-text)',
                textAlign: 'center', lineHeight: 1.3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80,
              }}>
                {k.ad}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: 6 kolon grid */}
      <div className="hidden lg:block">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {gorsel.map((k) => (
            <Link
              key={k.slug}
              href={`/kategori/${k.slug}`}
              className="group"
              style={{
                padding: '28px 16px 24px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                borderRadius: 20,
                background: `${k.renk}12`,
                border: `1.5px solid ${k.renk}30`,
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = `0 12px 32px ${k.renk}30`
                el.style.background = `${k.renk}22`
                el.style.borderColor = `${k.renk}60`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                el.style.background = `${k.renk}12`
                el.style.borderColor = `${k.renk}30`
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: `${k.renk}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14, fontSize: 30,
                transition: 'transform 0.25s',
                boxShadow: `0 4px 16px ${k.renk}25`,
              }} className="group-hover:scale-110">
                {k.ikon}
              </div>
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.3,
                transition: 'color 0.2s',
              }} className={`group-hover:text-[${k.renk}]`}>
                {k.ad}
              </span>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            href="/ara"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 32px', fontSize: 14, fontWeight: 700,
              color: 'var(--color-primary)', background: 'var(--color-primary-light)',
              border: '1.5px solid var(--color-primary)', borderRadius: 14,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--color-primary)'
              el.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--color-primary-light)'
              el.style.color = 'var(--color-primary)'
            }}
          >
            Tüm Kategorileri Gör →
          </Link>
        </div>
      </div>
    </>
  )
}
