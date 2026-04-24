'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Props {
  href: string
  ikon: string
  label: string
  desc: string
}

export function HizliErisimKart({ href, ikon, label, desc }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: `1px solid ${hovered ? '#F27A1A' : 'var(--color-border)'}`,
          padding: '18px 20px',
          transition: 'all 0.2s',
          cursor: 'pointer',
          boxShadow: hovered ? '0 4px 16px rgba(242,122,26,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ fontSize: 24, marginBottom: 10 }}>{ikon}</div>
        <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{desc}</p>
      </div>
    </Link>
  )
}
