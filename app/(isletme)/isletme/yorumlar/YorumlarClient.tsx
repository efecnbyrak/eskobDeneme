'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

interface Yorum {
  id: number
  puan: number
  yorum: string | null
  musteriAd: string
  yanitlar: string | null
  onaylı: boolean
  bildirildi: boolean
  olusturmaT: string
}

interface Props {
  yorumlar: Yorum[]
  ortalama: string | null
}

function maskeleIsim(isim: string): string {
  return isim
    .split(' ')
    .map((kelime) => {
      if (kelime.length <= 1) return kelime
      return kelime[0] + '*'.repeat(kelime.length - 1)
    })
    .join(' ')
}

export function YorumlarClient({ yorumlar: baslangicYorumlar, ortalama }: Props) {
  const { toast } = useToast()
  const [yorumlar, setYorumlar] = useState(baslangicYorumlar)
  const [bildirYukleniyor, setBildirYukleniyor] = useState<number | null>(null)
  const [bildirimOnayId, setBildirimOnayId] = useState<number | null>(null)

  async function bildir(yorumId: number) {
    setBildirYukleniyor(yorumId)
    setBildirimOnayId(null)
    try {
      const res = await fetch(`/api/yorum/${yorumId}/bildir`, { method: 'POST' })
      if (res.ok) {
        setYorumlar((prev) =>
          prev.map((y) => (y.id === yorumId ? { ...y, bildirildi: true } : y))
        )
        toast('Yorum bildirildi. İnceleme için iletildi.', 'success')
      } else {
        const d = await res.json()
        toast(d.error || 'Bir hata oluştu.', 'error')
      }
    } finally {
      setBildirYukleniyor(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Yorumlar</h1>
          <p className="text-slate-500 text-sm mt-0.5">Toplam {yorumlar.length} yorum</p>
        </div>
        {ortalama && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-amber-700 text-lg">{ortalama}</span>
            <span className="text-xs text-amber-600">/ 5</span>
          </div>
        )}
      </div>

      {yorumlar.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <p className="text-5xl mb-4">⭐</p>
          <p className="font-semibold text-slate-700">Henüz yorum yok</p>
          <p className="text-slate-400 text-sm mt-1">
            Müşterileriniz vitrininizdeki yorum formundan değerlendirme bırakabilir.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {yorumlar.map((y) => (
            <div key={y.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-sm text-slate-800">{maskeleIsim(y.musteriAd)}</p>
                    {y.bildirildi && (
                      <Badge variant="warning">Bildirildi</Badge>
                    )}
                    <span className="text-xs text-slate-400">{formatTarih(y.olusturmaT)}</span>
                  </div>
                  {y.yorum && (
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{y.yorum}</p>
                  )}
                  {y.yanitlar && (
                    <div className="mt-3 pl-3 border-l-2 border-indigo-200">
                      <p className="text-xs font-semibold text-indigo-600 mb-0.5">İşletme Yanıtı</p>
                      <p className="text-sm text-slate-600">{y.yanitlar}</p>
                    </div>
                  )}
                  <div className="mt-3">
                    {y.bildirildi ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 font-medium">
                        ⚑ Bildirildi — İnceleniyor
                      </span>
                    ) : bildirimOnayId === y.id ? (
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                        <span className="text-xs text-red-700 font-medium">Bu yorumu bildirmek istediğinizden emin misiniz?</span>
                        <button
                          onClick={() => bildir(y.id)}
                          disabled={bildirYukleniyor === y.id}
                          className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                        >
                          {bildirYukleniyor === y.id ? '⏳' : 'Evet, Bildir'}
                        </button>
                        <button
                          onClick={() => setBildirimOnayId(null)}
                          className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setBildirimOnayId(y.id)}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        ⚑ Yorum Bildir
                      </button>
                    )}
                  </div>
                </div>
                <YildizPuan puan={y.puan} boyut="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
