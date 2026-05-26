'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'

const BILDIRIMLER = [
  { key: 'yeniRandevu', baslik: 'Yeni Randevu', aciklama: 'Müşteri randevu aldığında bildirim gönder', varsayilan: true },
  { key: 'randevuIptali', baslik: 'Randevu İptali', aciklama: 'Müşteri randevuyu iptal ettiğinde bildirim gönder', varsayilan: true },
  { key: 'yeniYorum', baslik: 'Yeni Yorum', aciklama: 'Yeni bir değerlendirme geldiğinde bildirim gönder', varsayilan: true },
  { key: 'kampanyaBitis', baslik: 'Kampanya Bitiş Uyarısı', aciklama: 'Aktif kampanya sona ermeden önce uyar', varsayilan: false },
]

interface Props {
  esnafId: number
  baslangicAyarlari: Record<string, boolean>
}

export function BildirimlerClient({ esnafId, baslangicAyarlari }: Props) {
  const { toast } = useToast()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [ayarlar, setAyarlar] = useState<Record<string, boolean>>(() => {
    const baslangic: Record<string, boolean> = {}
    BILDIRIMLER.forEach((b) => {
      baslangic[b.key] = baslangicAyarlari[b.key] ?? b.varsayilan
    })
    return baslangic
  })

  function toggle(key: string) {
    setAyarlar((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function kaydet() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnafId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bildirimAyarlari: ayarlar }),
      })
      if (res.ok) {
        toast('Bildirim ayarları kaydedildi.', 'success')
      } else {
        const d = await res.json()
        toast(d.error || 'Bir hata oluştu.', 'error')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Bildirimler</h1>
        <p className="text-slate-500 text-sm mt-0.5">Bildirim tercihlerinizi yönetin</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {BILDIRIMLER.map((b) => (
          <div key={b.key} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">{b.baslik}</p>
              <p className="text-xs text-slate-400 mt-0.5">{b.aciklama}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(b.key)}
              className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none shrink-0 ${
                ayarlar[b.key] ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
              role="switch"
              aria-checked={ayarlar[b.key]}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  ayarlar[b.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={kaydet} loading={yukleniyor}>
        Ayarları Kaydet
      </Button>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <p className="font-semibold mb-1">🔔 E-posta Bildirimleri</p>
        <p>Bildirimler kayıtlı e-posta adresinize gönderilir. Mobil push bildirimleri uygulamadan aktif edilebilir.</p>
      </div>
    </div>
  )
}
