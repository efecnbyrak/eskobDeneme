'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'

const GUNLER = [
  { key: 'pazartesi', label: 'Pazartesi' },
  { key: 'sali', label: 'Salı' },
  { key: 'carsamba', label: 'Çarşamba' },
  { key: 'persembe', label: 'Perşembe' },
  { key: 'cuma', label: 'Cuma' },
  { key: 'cumartesi', label: 'Cumartesi' },
  { key: 'pazar', label: 'Pazar' },
]

interface GunAyar {
  acik: boolean
  acilis: string
  kapanis: string
}

type CalismaSaatleri = Record<string, GunAyar>

const VARSAYILAN: CalismaSaatleri = Object.fromEntries(
  GUNLER.map(({ key }) => [key, { acik: true, acilis: '09:00', kapanis: '18:00' }])
)

interface Props {
  esnafId: number
  baslangicSaatler: Record<string, { acik: boolean; acilis: string; kapanis: string }>
}

export function CalismaSaatleriClient({ esnafId, baslangicSaatler }: Props) {
  const { toast } = useToast()
  const [saatler, setSaatler] = useState<CalismaSaatleri>({ ...VARSAYILAN, ...baslangicSaatler })
  const [yukleniyor, setYukleniyor] = useState(false)

  function gunGuncelle(gun: string, alan: keyof GunAyar, deger: string | boolean) {
    setSaatler((prev) => ({ ...prev, [gun]: { ...prev[gun], [alan]: deger } }))
  }

  async function handleKaydet() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/esnaf/${esnafId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calisma: saatler }),
      })
      if (res.ok) toast('Çalışma saatleri güncellendi!', 'success')
      else toast('Bir hata oluştu.', 'error')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Çalışma Saatleri</h1>
        <p className="text-slate-500 text-sm mt-0.5">Haftalık çalışma saatlerinizi belirleyin</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {GUNLER.map(({ key, label }) => {
          const gun = saatler[key] ?? { acik: false, acilis: '09:00', kapanis: '18:00' }
          return (
            <div key={key} className="flex items-center gap-4 px-6 py-4">
              <div className="w-28 shrink-0">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
              </div>

              <button
                type="button"
                onClick={() => gunGuncelle(key, 'acik', !gun.acik)}
                className={`relative w-10 h-5 rounded-full transition-colors shrink-0 focus:outline-none ${gun.acik ? 'bg-indigo-500' : 'bg-slate-200'}`}
                role="switch"
                aria-checked={gun.acik}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${gun.acik ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>

              {gun.acik ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={gun.acilis}
                    onChange={(e) => gunGuncelle(key, 'acilis', e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <span className="text-slate-400 text-sm">—</span>
                  <input
                    type="time"
                    value={gun.kapanis}
                    onChange={(e) => gunGuncelle(key, 'kapanis', e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-400 flex-1">Kapalı</span>
              )}
            </div>
          )
        })}
      </div>

      <Button onClick={handleKaydet} loading={yukleniyor}>
        Değişiklikleri Kaydet
      </Button>
    </div>
  )
}
