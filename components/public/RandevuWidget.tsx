'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRandevu } from '@/hooks/useRandevu'
import type { Hizmet } from '@/types'

interface RandevuWidgetProps {
  esnafId: string
  hizmetler: Hizmet[]
}

export function RandevuWidget({ esnafId, hizmetler }: RandevuWidgetProps) {
  const { randevuOlustur, yukleniyor, hata } = useRandevu()
  const [basarili, setBasarili] = useState(false)
  const [form, setForm] = useState({
    musteriAd: '',
    musteriTelefon: '',
    musteriNot: '',
    hizmetId: '',
    tarih: '',
  })

  const seciliHizmet = hizmetler.find((h) => h.id === form.hizmetId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const sure = seciliHizmet?.sure || 60
    const sonuc = await randevuOlustur({
      ...form,
      esnafId,
      sure,
      tarih: new Date(form.tarih).toISOString(),
    })
    if (sonuc) setBasarili(true)
  }

  if (basarili) {
    return (
      <div className="bg-[var(--color-success-light)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-semibold text-[var(--color-success)]">Randevunuz alındı!</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          İşletme sizinle iletişime geçecek.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
        Randevu Al
      </h3>

      {hizmetler.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Hizmet</label>
          <select
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            value={form.hizmetId}
            onChange={(e) => setForm((p) => ({ ...p, hizmetId: e.target.value }))}
          >
            <option value="">Hizmet seçin</option>
            {hizmetler.map((h) => (
              <option key={h.id} value={h.id}>
                {h.ad}
              </option>
            ))}
          </select>
        </div>
      )}

      <Input
        label="Tarih & Saat"
        type="datetime-local"
        required
        value={form.tarih}
        onChange={(e) => setForm((p) => ({ ...p, tarih: e.target.value }))}
      />
      <Input
        label="Adınız"
        required
        placeholder="Adınız Soyadınız"
        value={form.musteriAd}
        onChange={(e) => setForm((p) => ({ ...p, musteriAd: e.target.value }))}
      />
      <Input
        label="Telefon"
        type="tel"
        required
        placeholder="05XX XXX XX XX"
        value={form.musteriTelefon}
        onChange={(e) => setForm((p) => ({ ...p, musteriTelefon: e.target.value }))}
      />
      <Input
        label="Not (isteğe bağlı)"
        placeholder="Eklemek istediğiniz not..."
        value={form.musteriNot}
        onChange={(e) => setForm((p) => ({ ...p, musteriNot: e.target.value }))}
      />

      {hata && <p className="text-sm text-red-500">{hata}</p>}

      <Button type="submit" loading={yukleniyor} className="w-full">
        Randevu Onayla
      </Button>
    </form>
  )
}
