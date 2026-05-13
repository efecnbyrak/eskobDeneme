'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

interface Props {
  esnafId: number
  kategoriSlug: string
  kategoriAd: string
  ustKategoriAd: string | null
  mevcutAyarlar: Record<string, unknown>
}

// Her kategori slug için özel form alanları
const KATEGORI_ALANLARI: Record<string, { key: string; label: string; tip: 'text' | 'number' | 'boolean' | 'textarea'; aciklama?: string }[]> = {
  berber: [
    { key: 'personelSayisi', label: 'Personel Sayısı', tip: 'number', aciklama: 'Kaç berber çalışıyor?' },
    { key: 'koltukSayisi', label: 'Koltuk Sayısı', tip: 'number' },
    { key: 'kadinKabul', label: 'Kadın Müşteri Kabul', tip: 'boolean' },
    { key: 'ozellikler', label: 'Özel Özellikler', tip: 'textarea', aciklama: 'Örn: sakal tıraşı, keratin, boyama' },
  ],
  'kuafor': [
    { key: 'personelSayisi', label: 'Personel Sayısı', tip: 'number' },
    { key: 'erkekKabul', label: 'Erkek Müşteri Kabul', tip: 'boolean' },
    { key: 'ozellikler', label: 'Sunulan Hizmetler', tip: 'textarea', aciklama: 'Örn: keratin, boya, kaynak' },
  ],
  restoran: [
    { key: 'masaSayisi', label: 'Masa Sayısı', tip: 'number' },
    { key: 'oturmaKapasitesi', label: 'Oturma Kapasitesi', tip: 'number' },
    { key: 'paketServis', label: 'Paket Servis', tip: 'boolean' },
    { key: 'rezervasyon', label: 'Rezervasyon Kabul', tip: 'boolean' },
    { key: 'mutfakTuru', label: 'Mutfak Türü', tip: 'text', aciklama: 'Örn: Türk, İtalyan, Dünya mutfağı' },
    { key: 'vejeteryanMenu', label: 'Vejetaryen Menü', tip: 'boolean' },
  ],
  kafe: [
    { key: 'oturmaKapasitesi', label: 'Oturma Kapasitesi', tip: 'number' },
    { key: 'disAlan', label: 'Dış Alan (Teras)', tip: 'boolean' },
    { key: 'veganSecenekler', label: 'Vegan Seçenekler', tip: 'boolean' },
    { key: 'calismaAkimi', label: 'Çalışma/Laptop Dostu', tip: 'boolean' },
  ],
  'fast-food': [
    { key: 'paketServis', label: 'Paket Servis', tip: 'boolean' },
    { key: 'onlineSiparis', label: 'Online Sipariş', tip: 'boolean' },
    { key: 'masaSayisi', label: 'Masa Sayısı', tip: 'number' },
  ],
  'spa-masaj': [
    { key: 'kabin Sayisi', label: 'Kabin Sayısı', tip: 'number' },
    { key: 'hamam', label: 'Hamam', tip: 'boolean' },
    { key: 'sauna', label: 'Sauna', tip: 'boolean' },
    { key: 'personelSayisi', label: 'Uzman Sayısı', tip: 'number' },
    { key: 'ciftKabinVar', label: 'Çift Kabini Var', tip: 'boolean' },
  ],
}

const VARSAYILAN_ALANLAR = [
  { key: 'personelSayisi', label: 'Personel Sayısı', tip: 'number' as const },
  { key: 'ozellikler', label: 'Özellikler / Notlar', tip: 'textarea' as const, aciklama: 'İşletmenize özel detaylar' },
]

export function KategoriAyarlariClient({ esnafId, kategoriSlug, kategoriAd, ustKategoriAd, mevcutAyarlar }: Props) {
  const alanlar = KATEGORI_ALANLARI[kategoriSlug] ?? VARSAYILAN_ALANLAR
  const { toast } = useToast()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    alanlar.forEach((a) => {
      initial[a.key] = mevcutAyarlar[a.key] ?? (a.tip === 'boolean' ? false : a.tip === 'number' ? '' : '')
    })
    return initial
  })

  async function handleKaydet() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnafId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kategoriAyarlari: form }),
      })
      if (res.ok) {
        toast('Kategori ayarları kaydedildi', 'success')
      } else {
        toast('Kayıt sırasında hata oluştu', 'error')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-semibold text-slate-800 mb-1 font-display">
        {kategoriAd} Özel Ayarları
      </h2>
      {ustKategoriAd && (
        <p className="text-sm text-slate-400 mb-5">{ustKategoriAd} kategorisi altında</p>
      )}

      <div className="space-y-5">
        {alanlar.map((alan) => (
          <div key={alan.key}>
            {alan.tip === 'boolean' ? (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!!form[alan.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [alan.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${form[alan.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  />
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${form[alan.key] ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{alan.label}</p>
                  {alan.aciklama && <p className="text-xs text-slate-400">{alan.aciklama}</p>}
                </div>
              </label>
            ) : alan.tip === 'textarea' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">{alan.label}</label>
                {alan.aciklama && <p className="text-xs text-slate-400 -mt-1">{alan.aciklama}</p>}
                <textarea
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
                  rows={3}
                  value={String(form[alan.key] || '')}
                  onChange={(e) => setForm((p) => ({ ...p, [alan.key]: e.target.value }))}
                />
              </div>
            ) : (
              <Input
                label={alan.label}
                type={alan.tip === 'number' ? 'number' : 'text'}
                min={0}
                value={String(form[alan.key] || '')}
                onChange={(e) => setForm((p) => ({ ...p, [alan.key]: alan.tip === 'number' ? Number(e.target.value) : e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <Button onClick={handleKaydet} loading={yukleniyor}>
          Kaydet
        </Button>
      </div>
    </div>
  )
}
