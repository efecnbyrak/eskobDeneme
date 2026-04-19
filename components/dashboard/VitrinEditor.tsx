'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import type { Esnaf } from '@/types'

interface VitrinEditorProps {
  esnaf: Esnaf
}

export function VitrinEditor({ esnaf }: VitrinEditorProps) {
  const { toast } = useToast()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({
    isletmeAdi: esnaf.isletmeAdi,
    aciklama: esnaf.aciklama || '',
    telefon: esnaf.telefon || '',
    whatsapp: esnaf.whatsapp || '',
    website: esnaf.website || '',
    instagram: esnaf.instagram || '',
    kapakFoto: esnaf.kapakFoto || '',
    logoUrl: esnaf.logoUrl || '',
  })

  async function handleKaydet() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnaf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) toast('Vitrin güncellendi!', 'success')
      else toast('Bir hata oluştu.', 'error')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="İşletme Adı"
          value={form.isletmeAdi}
          onChange={(e) => setForm((p) => ({ ...p, isletmeAdi: e.target.value }))}
        />
        <Input
          label="Telefon"
          value={form.telefon}
          onChange={(e) => setForm((p) => ({ ...p, telefon: e.target.value }))}
        />
        <Input
          label="WhatsApp"
          value={form.whatsapp}
          onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
        />
        <Input
          label="Instagram"
          value={form.instagram}
          onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
        />
        <Input
          label="Website"
          value={form.website}
          onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Açıklama</label>
        <textarea
          className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] resize-none"
          rows={4}
          maxLength={500}
          value={form.aciklama}
          onChange={(e) => setForm((p) => ({ ...p, aciklama: e.target.value }))}
        />
        <p className="text-xs text-[var(--color-text-secondary)] text-right">{form.aciklama.length}/500</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Kapak Fotoğrafı URL"
          value={form.kapakFoto}
          onChange={(e) => setForm((p) => ({ ...p, kapakFoto: e.target.value }))}
        />
        <Input
          label="Logo URL"
          value={form.logoUrl}
          onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
        />
      </div>

      <Button onClick={handleKaydet} loading={yukleniyor}>
        Değişiklikleri Kaydet
      </Button>
    </div>
  )
}
