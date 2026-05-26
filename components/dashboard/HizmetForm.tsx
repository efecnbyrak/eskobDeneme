'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Hizmet } from '@/types'

interface KategoriSeceneği {
  id: number
  ad: string
  altlar?: { id: number; ad: string }[]
}

interface HizmetFormProps {
  esnafId: number
  hizmet?: Hizmet
  kategoriler?: KategoriSeceneği[]
  onKayit: (hizmet: Hizmet) => void
  onIptal: () => void
}

const IKONLAR = ['✂️', '💆', '💅', '🛁', '🧴', '💇', '🏋️', '🍽️', '🚗', '🔧', '📸', '🎨', '🧹', '🐾', '💊']

type HizmetEk = {
  kategori?: string
  indirimYuzde?: number
  oneCikan?: boolean
  sira?: number
  ikon?: string
  onlineOdeme?: boolean
  minOnRezervasyon?: number
  maksKatilimci?: number
  etiketler?: string[]
}

export function HizmetForm({ esnafId, hizmet, kategoriler = [], onKayit, onIptal }: HizmetFormProps) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const h = hizmet as (typeof hizmet & HizmetEk) | undefined
  const [form, setForm] = useState({
    ad: h?.ad || '',
    aciklama: h?.aciklama || '',
    fiyat: h?.fiyat || 0,
    sure: h?.sure || 60,
    kategori: h?.kategori || '',
    hizmetKategorisiId: (h as unknown as { hizmetKategorisiId?: number | null })?.hizmetKategorisiId ?? null as number | null,
    indirimYuzde: h?.indirimYuzde || 0,
    oneCikan: h?.oneCikan || false,
    sira: h?.sira || 0,
    ikon: h?.ikon || '',
    onlineOdeme: h?.onlineOdeme || false,
    minOnRezervasyon: h?.minOnRezervasyon || 0,
    maksKatilimci: h?.maksKatilimci || 1,
    etiketler: h?.etiketler || [] as string[],
  })
  const [ikonSecici, setIkonSecici] = useState(false)
  const [etiketInput, setEtiketInput] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setYukleniyor(true)
    try {
      const method = hizmet ? 'PUT' : 'POST'
      const url = hizmet ? `/api/hizmet?id=${hizmet.id}` : '/api/hizmet'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, esnafId, hizmetKategorisiId: form.hizmetKategorisiId ?? null }),
      })
      const data = await res.json()
      onKayit(data.data ?? data)
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hizmet Adı + İkon */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            label="Hizmet Adı"
            required
            value={form.ad}
            onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">İkon</label>
          <button
            type="button"
            onClick={() => setIkonSecici(!ikonSecici)}
            className="w-12 h-10 text-xl border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-slate-50 transition-colors"
            title="İkon seç"
          >
            {form.ikon || '➕'}
          </button>
        </div>
      </div>

      {/* İkon Seçici */}
      {ikonSecici && (
        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
          <p className="text-xs text-slate-500 mb-2 font-medium">Bir ikon seçin:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setForm((p) => ({ ...p, ikon: '' })); setIkonSecici(false) }}
              className="w-9 h-9 text-sm border border-slate-200 rounded-lg hover:bg-white transition-colors text-slate-400"
              title="İkon yok"
            >
              —
            </button>
            {IKONLAR.map((ikon) => (
              <button
                key={ikon}
                type="button"
                onClick={() => { setForm((p) => ({ ...p, ikon })); setIkonSecici(false) }}
                className={`w-9 h-9 text-xl border rounded-lg hover:bg-white transition-colors ${form.ikon === ikon ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200'}`}
              >
                {ikon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Açıklama */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Açıklama</label>
        <textarea
          className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] resize-none"
          rows={3}
          value={form.aciklama}
          onChange={(e) => setForm((p) => ({ ...p, aciklama: e.target.value }))}
          placeholder="Hizmet hakkında kısa açıklama..."
        />
      </div>

      {/* Fiyat + Süre */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Fiyat (₺)</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={0}
            required
            value={form.fiyat === 0 ? '' : form.fiyat}
            placeholder="0"
            onChange={(e) => setForm((p) => ({ ...p, fiyat: e.target.value === '' ? 0 : Number(e.target.value) }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Süre (dakika)</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={5}
            value={form.sure}
            onChange={(e) => setForm((p) => ({ ...p, sure: Number(e.target.value) }))}
          />
        </div>
      </div>

      {/* İndirim + Sıra */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">İndirim Yüzdesi (%)</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={form.indirimYuzde === 0 ? '' : form.indirimYuzde}
            placeholder="0"
            onChange={(e) => setForm((p) => ({ ...p, indirimYuzde: e.target.value === '' ? 0 : Number(e.target.value) }))}
          />
          {form.indirimYuzde > 0 && form.fiyat > 0 && (
            <p className="text-xs text-emerald-600 font-medium">
              İndirimli fiyat: ₺{(Number(form.fiyat) * (1 - form.indirimYuzde / 100)).toFixed(0)}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Sıra Numarası</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.sira === 0 ? '' : form.sira}
            placeholder="0"
            onChange={(e) => setForm((p) => ({ ...p, sira: e.target.value === '' ? 0 : Number(e.target.value) }))}
          />
          <p className="text-xs text-slate-400">Küçük numara önce görünür</p>
        </div>
      </div>

      {/* Hizmet Kategorisi */}
      {kategoriler.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Kategori</label>
          <select
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] bg-white"
            value={form.hizmetKategorisiId ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, hizmetKategorisiId: e.target.value ? Number(e.target.value) : null }))}
          >
            <option value="">— Kategori Seçin —</option>
            {kategoriler.map((k) => (
              <optgroup key={k.id} label={k.ad}>
                <option value={k.id}>{k.ad}</option>
                {k.altlar?.map((a) => (
                  <option key={a.id} value={a.id}>{'  '}↳ {a.ad}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {/* Öne Çıkar Toggle */}
      <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-amber-800">Öne Çıkar</p>
          <p className="text-xs text-amber-600 mt-0.5">Bu hizmet vitrininde öne çıkarılır</p>
        </div>
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, oneCikan: !p.oneCikan }))}
          className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${form.oneCikan ? 'bg-amber-500' : 'bg-slate-200'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.oneCikan ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Online Ödeme Toggle */}
      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Online Ödeme Mevcut</p>
          <p className="text-xs text-emerald-600 mt-0.5">Bu hizmet için online ödeme kabul edilir</p>
        </div>
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, onlineOdeme: !p.onlineOdeme }))}
          className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${form.onlineOdeme ? 'bg-emerald-500' : 'bg-slate-200'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.onlineOdeme ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Min. Rezervasyon + Maks. Katılımcı */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Min. Ön Rezervasyon (saat)</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.minOnRezervasyon === 0 ? '' : form.minOnRezervasyon}
            placeholder="0"
            onChange={(e) => setForm((p) => ({ ...p, minOnRezervasyon: e.target.value === '' ? 0 : Number(e.target.value) }))}
          />
          <p className="text-xs text-slate-400">Randevu en az kaç saat önceden alınabilir</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Maks. Katılımcı</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={1}
            value={form.maksKatilimci}
            onChange={(e) => setForm((p) => ({ ...p, maksKatilimci: Math.max(1, Number(e.target.value)) }))}
          />
          <p className="text-xs text-slate-400">Aynı anda kaç kişi bu hizmeti alabilir</p>
        </div>
      </div>

      {/* Etiketler */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Hizmet Etiketleri</label>
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            type="text"
            value={etiketInput}
            placeholder="ör. Kadın, Erkek, Çocuk, Vegan..."
            onChange={(e) => setEtiketInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && etiketInput.trim()) {
                e.preventDefault()
                const yeni = etiketInput.trim().replace(/,$/, '')
                if (yeni && !form.etiketler.includes(yeni)) {
                  setForm((p) => ({ ...p, etiketler: [...p.etiketler, yeni] }))
                }
                setEtiketInput('')
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const yeni = etiketInput.trim()
              if (yeni && !form.etiketler.includes(yeni)) {
                setForm((p) => ({ ...p, etiketler: [...p.etiketler, yeni] }))
              }
              setEtiketInput('')
            }}
            className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-slate-50 transition-colors"
          >
            Ekle
          </button>
        </div>
        {form.etiketler.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {form.etiketler.map((etiket) => (
              <span
                key={etiket}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full"
              >
                {etiket}
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, etiketler: p.etiketler.filter((e) => e !== etiket) }))}
                  className="text-indigo-400 hover:text-indigo-700 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400">Enter veya virgül ile etiket ekleyin</p>
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
