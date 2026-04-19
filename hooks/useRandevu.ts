'use client'

import { useState } from 'react'
import type { Randevu } from '@/types'

export function useRandevu() {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)

  async function randevuOlustur(data: Omit<Randevu, 'id' | 'olusturmaT' | 'durum'>) {
    setYukleniyor(true)
    setHata(null)
    try {
      const res = await fetch('/api/randevu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Randevu oluşturulamadı')
      return await res.json()
    } catch (e) {
      setHata(e instanceof Error ? e.message : 'Hata oluştu')
      return null
    } finally {
      setYukleniyor(false)
    }
  }

  return { randevuOlustur, yukleniyor, hata }
}
