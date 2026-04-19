'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Hizmet } from '@/types'

interface HizmetFormProps {
  esnafId: string
  hizmet?: Hizmet
  onKayit: (hizmet: Hizmet) => void
  onIptal: () => void
}

export function HizmetForm({ esnafId, hizmet, onKayit, onIptal }: HizmetFormProps) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({
    ad: hizmet?.ad || '',
    aciklama: hizmet?.aciklama || '',
    fiyat: hizmet?.fiyat || 0,
    sure: hizmet?.sure || 60,
    kategori: (hizmet as { kategori?: string })?.kategori || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setYukleniyor(true)
    try {
      const method = hizmet ? 'PUT' : 'POST'
      const url = hizmet ? `/api/hizmet?id=${hizmet.id}` : '/api/hizmet'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, esnafId }),
      })
      const data = await res.json()
      onKayit(data)
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Hizmet Adı"
        required
        value={form.ad}
        onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Açıklama</label>
        <textarea
          className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] resize-none"
          rows={3}
          value={form.aciklama}
          onChange={(e) => setForm((p) => ({ ...p, aciklama: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fiyat (₺)"
          type="number"
          min={0}
          required
          value={form.fiyat}
          onChange={(e) => setForm((p) => ({ ...p, fiyat: Number(e.target.value) }))}
        />
        <Input
          label="Süre (dakika)"
          type="number"
          min={5}
          value={form.sure}
          onChange={(e) => setForm((p) => ({ ...p, sure: Number(e.target.value) }))}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={yukleniyor} className="flex-1">
          {hizmet ? 'Güncelle' : 'Ekle'}
        </Button>
        <Button type="button" variant="secondary" onClick={onIptal} className="flex-1">
          İptal
        </Button>
      </div>
    </form>
  )
}
