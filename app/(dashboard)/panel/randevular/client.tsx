'use client'

import { useState } from 'react'
import { RandevuTakvim } from '@/components/dashboard/RandevuTakvim'
import type { Randevu, RandevuDurum } from '@/types'

interface Props {
  esnafId: number
  randevular: Randevu[]
}

export function RandevuTakvimClient({ esnafId, randevular: initial }: Props) {
  const [randevular, setRandevular] = useState(initial)

  async function durumGuncelle(id: number, durum: RandevuDurum) {
    await fetch(`/api/randevu?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ durum }),
    })
    setRandevular((prev) =>
      prev.map((r) => (r.id === id ? { ...r, durum } : r))
    )
  }

  return <RandevuTakvim randevular={randevular} onDurumGuncelle={durumGuncelle} />
}
