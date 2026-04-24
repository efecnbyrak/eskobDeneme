'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { KATEGORILER, SEHIRLER, GUNLER } from '@/lib/constants'

const TOPLAM_ADIM = 5

export function OnboardingWizard() {
  const router = useRouter()
  const [adim, setAdim] = useState(1)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({
    isletmeAdi: '',
    kategoriSlug: '',
    sehir: '',
    ilce: '',
    adres: '',
    telefon: '',
    whatsapp: '',
    instagram: '',
    logoUrl: '',
    kapakFoto: '',
    calismaS: Object.fromEntries(
      GUNLER.map((g) => [g.key, { acik: '09:00', kapali: '18:00', kapali_gun: false }])
    ),
  })

  function set(key: string, value: unknown) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function handleTamamla() {
    setYukleniyor(true)
    try {
      const res = await fetch('/api/esnaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/isletme/panel')
    } finally {
      setYukleniyor(false)
    }
  }

  const ilerleme = (adim / TOPLAM_ADIM) * 100

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-[var(--color-text-secondary)]">Adım {adim}/{TOPLAM_ADIM}</p>
          <p className="text-sm font-medium text-[var(--color-success)]">%{Math.round(ilerleme)} tamamlandı</p>
        </div>
        <div className="h-2 bg-[var(--color-bg-muted)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-success)] rounded-full transition-all duration-500"
            style={{ width: `${ilerleme}%` }}
          />
        </div>
      </div>

      {adim === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            İşletme Bilgileri
          </h2>
          <Input
            label="İşletme Adı"
            required
            placeholder="Örn: Ali Usta Berber"
            value={form.isletmeAdi}
            onChange={(e) => set('isletmeAdi', e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Kategori</label>
            <div className="grid grid-cols-3 gap-2">
              {KATEGORILER.map((k) => (
                <button
                  key={k.slug}
                  type="button"
                  onClick={() => set('kategoriSlug', k.slug)}
                  className={`p-3 border rounded-[var(--radius-md)] text-center text-sm transition-all ${
                    form.kategoriSlug === k.slug
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] font-medium'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <div className="text-xl mb-1">{k.ikon}</div>
                  <div className="text-xs">{k.ad}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {adim === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Konum
          </h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Şehir</label>
            <select
              className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
              value={form.sehir}
              onChange={(e) => set('sehir', e.target.value)}
            >
              <option value="">Şehir seçin</option>
              {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="İlçe" placeholder="Kadıköy" value={form.ilce} onChange={(e) => set('ilce', e.target.value)} />
          <Input label="Adres" placeholder="Tam adresiniz" value={form.adres} onChange={(e) => set('adres', e.target.value)} />
        </div>
      )}

      {adim === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            İletişim
          </h2>
          <Input label="Telefon" type="tel" placeholder="05XX XXX XX XX" value={form.telefon} onChange={(e) => set('telefon', e.target.value)} />
          <Input label="WhatsApp" type="tel" placeholder="05XX XXX XX XX" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
          <Input label="Instagram" placeholder="@kullanici_adi" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
        </div>
      )}

      {adim === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Görseller
          </h2>
          <Input label="Logo URL" placeholder="https://..." value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} hint="Logo URL'si yapıştırın" />
          <Input label="Kapak Fotoğrafı URL" placeholder="https://..." value={form.kapakFoto} onChange={(e) => set('kapakFoto', e.target.value)} hint="Kapak fotoğrafı URL'si yapıştırın" />
        </div>
      )}

      {adim === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Çalışma Saatleri
          </h2>
          <div className="space-y-3">
            {GUNLER.map((g) => {
              const gs = form.calismaS[g.key] as { acik: string; kapali: string; kapali_gun: boolean }
              return (
                <div key={g.key} className="flex items-center gap-3">
                  <span className="w-20 text-sm">{g.ad}</span>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!gs.kapali_gun}
                      onChange={(e) => set('calismaS', { ...form.calismaS, [g.key]: { ...gs, kapali_gun: !e.target.checked } })}
                    />
                    Açık
                  </label>
                  {!gs.kapali_gun && (
                    <>
                      <input type="time" value={gs.acik} onChange={(e) => set('calismaS', { ...form.calismaS, [g.key]: { ...gs, acik: e.target.value } })} className="text-sm border border-[var(--color-border)] rounded px-2 py-1" />
                      <span className="text-sm text-[var(--color-text-secondary)]">—</span>
                      <input type="time" value={gs.kapali} onChange={(e) => set('calismaS', { ...form.calismaS, [g.key]: { ...gs, kapali: e.target.value } })} className="text-sm border border-[var(--color-border)] rounded px-2 py-1" />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        {adim > 1 && (
          <Button variant="secondary" onClick={() => setAdim((a) => a - 1)} className="flex-1">
            Geri
          </Button>
        )}
        {adim < TOPLAM_ADIM ? (
          <Button onClick={() => setAdim((a) => a + 1)} className="flex-1">
            Devam
          </Button>
        ) : (
          <Button onClick={handleTamamla} loading={yukleniyor} className="flex-1">
            Tamamla 🎉
          </Button>
        )}
      </div>
    </div>
  )
}
