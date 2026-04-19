'use client'

import { useState, useEffect } from 'react'
import type { Esnaf } from '@/types'

interface EsnafFiltre {
  sehir?: string
  kategori?: string
  arama?: string
  sayfa?: number
}

export function useEsnaf(filtre: EsnafFiltre = {}) {
  const [esnaflar, setEsnaflar] = useState<Esnaf[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)
  const [toplamSayfa, setToplamSayfa] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filtre.sehir) params.set('sehir', filtre.sehir)
    if (filtre.kategori) params.set('kategori', filtre.kategori)
    if (filtre.arama) params.set('arama', filtre.arama)
    if (filtre.sayfa) params.set('sayfa', String(filtre.sayfa))

    setYukleniyor(true)
    fetch(`/api/esnaf?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setEsnaflar(data.esnaflar)
        setToplamSayfa(Math.ceil(data.toplam / 12))
      })
      .catch(() => setHata('Esnaflar yüklenemedi'))
      .finally(() => setYukleniyor(false))
  }, [filtre.sehir, filtre.kategori, filtre.arama, filtre.sayfa])

  return { esnaflar, yukleniyor, hata, toplamSayfa }
}
