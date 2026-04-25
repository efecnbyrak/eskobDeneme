'use client'

import { formatFiyat, formatSure } from '@/lib/utils'
import type { Hizmet } from '@/types'

interface HizmetListesiProps {
  hizmetler: Hizmet[]
  onRandevu?: (hizmet: Hizmet) => void
}

export function HizmetListesi({ hizmetler, onRandevu }: HizmetListesiProps) {
  if (!hizmetler.length) {
    return (
      <p className="text-[var(--color-text-secondary)] text-sm py-8 text-center">
        Henüz hizmet eklenmemiş.
      </p>
    )
  }

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {hizmetler.map((hizmet) => (
        <div key={hizmet.id} className="py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--color-text)] truncate">{hizmet.ad}</p>
            {hizmet.aciklama && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                {hizmet.aciklama}
              </p>
            )}
            {hizmet.sure && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                ⏱ {formatSure(hizmet.sure)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-semibold text-[var(--color-primary)]">
              {formatFiyat(Number(hizmet.fiyat))}
            </span>
            {onRandevu && (
              <button
                onClick={() => onRandevu(hizmet)}
                className="text-xs px-3 py-1.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-[var(--radius-full)] hover:bg-[var(--color-primary-light)] transition-colors"
              >
                Randevu Al
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
