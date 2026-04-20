'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatTarih } from '@/lib/utils'
import type { Randevu, RandevuDurum } from '@/types'

interface RandevuTakvimProps {
  randevular: Randevu[]
  onDurumGuncelle: (id: number, durum: RandevuDurum) => void
}

const durumRenk: Record<RandevuDurum, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  BEKLIYOR: 'warning',
  ONAYLANDI: 'success',
  IPTAL: 'danger',
  TAMAMLANDI: 'info',
}

const durumLabel: Record<RandevuDurum, string> = {
  BEKLIYOR: 'Bekliyor',
  ONAYLANDI: 'Onaylandı',
  IPTAL: 'İptal',
  TAMAMLANDI: 'Tamamlandı',
}

export function RandevuTakvim({ randevular, onDurumGuncelle }: RandevuTakvimProps) {
  if (!randevular.length) {
    return (
      <p className="text-[var(--color-text-secondary)] text-sm py-8 text-center">
        Henüz randevu bulunmuyor.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tarih</th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Müşteri</th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Telefon</th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Durum</th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {randevular.map((r) => (
            <tr key={r.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]">
              <td className="py-3 px-4">{formatTarih(r.tarih)}</td>
              <td className="py-3 px-4 font-medium">{r.musteriAd}</td>
              <td className="py-3 px-4">{r.musteriTelefon}</td>
              <td className="py-3 px-4">
                <Badge variant={durumRenk[r.durum]}>{durumLabel[r.durum]}</Badge>
              </td>
              <td className="py-3 px-4">
                <select
                  value={r.durum}
                  onChange={(e) => onDurumGuncelle(r.id, e.target.value as RandevuDurum)}
                  className="text-xs border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)]"
                >
                  <option value="BEKLIYOR">Bekliyor</option>
                  <option value="ONAYLANDI">Onayla</option>
                  <option value="IPTAL">İptal Et</option>
                  <option value="TAMAMLANDI">Tamamlandı</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
