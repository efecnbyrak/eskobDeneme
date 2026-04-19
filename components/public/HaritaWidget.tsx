'use client'

import { useEffect, useRef } from 'react'

interface HaritaWidgetProps {
  enlem: number
  boylam: number
  baslik: string
}

export function HaritaWidget({ enlem, boylam, baslik }: HaritaWidgetProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${boylam - 0.01}%2C${enlem - 0.01}%2C${boylam + 0.01}%2C${enlem + 0.01}&layer=mapnik&marker=${enlem}%2C${boylam}`

  return (
    <div className="w-full h-64 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)]">
      <iframe
        width="100%"
        height="100%"
        src={mapUrl}
        title={`${baslik} konumu`}
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  )
}
