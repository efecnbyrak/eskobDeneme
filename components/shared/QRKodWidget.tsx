'use client'

import { useEffect, useRef } from 'react'

interface QRKodWidgetProps {
  url: string
  boyut?: number
}

export function QRKodWidget({ url, boyut = 128 }: QRKodWidgetProps) {
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${boyut}x${boyut}&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=4F6D7A`

  return (
    <div className="flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={apiUrl}
        alt="QR Kod"
        width={boyut}
        height={boyut}
        className="rounded-[var(--radius-sm)]"
      />
      <p className="text-xs text-[var(--color-text-secondary)] text-center max-w-[140px] truncate">
        {url}
      </p>
    </div>
  )
}
