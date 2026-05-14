'use client'

import { useState } from 'react'

interface Props {
  yorumId: number
  baslangicBildirildi: boolean
}

export function YorumBildirButon({ yorumId, baslangicBildirildi }: Props) {
  const [bildirildi, setBildirildi] = useState(baslangicBildirildi)
  const [yukleniyor, setYukleniyor] = useState(false)

  if (bildirildi) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 font-medium">
        ⚑ Bildirildi — İnceleniyor
      </span>
    )
  }

  async function bildir() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/yorum/${yorumId}/bildir`, { method: 'POST' })
      if (res.ok) {
        setBildirildi(true)
      } else {
        const d = await res.json().catch(() => ({}))
        alert(d.error || 'Bir hata oluştu.')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <button
      onClick={bildir}
      disabled={yukleniyor}
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {yukleniyor ? '⏳ Bildiriliyor...' : '⚑ Yorum Bildir'}
    </button>
  )
}
