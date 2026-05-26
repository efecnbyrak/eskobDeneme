'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { formatFiyat } from '@/lib/utils'

interface Hizmet {
  id: number
  ad: string
  fiyat: number
  indirimYuzde: number | null
  indirimBitis: string | null
  hizmetKategorisiId?: number | null
}

interface Kategori {
  id: number
  ad: string
  altlar?: { id: number; ad: string }[]
}

interface IndirimForm {
  indirimYuzde: string
  indirimBitis: string
}

const now = new Date()

function kalanGunHesapla(bitisStr: string | null): number | null {
  if (!bitisStr) return null
  const bitis = new Date(bitisStr)
  if (bitis < now) return -1
  return Math.max(0, Math.ceil((bitis.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

export function KampanyalarClient({
  hizmetler: baslangic,
  kategoriler = [],
}: {
  hizmetler: Hizmet[]
  kategoriler?: Kategori[]
}) {
  const { toast } = useToast()
  const [hizmetler, setHizmetler] = useState(baslangic)
  const [acikForm, setAcikForm] = useState<number | null>(null)
  const [formlar, setFormlar] = useState<Record<number, IndirimForm>>({})
  const [yukleniyor, setYukleniyor] = useState<number | null>(null)
  const [aktifKategori, setAktifKategori] = useState<number | null>(null)

  // Tüm kategori id'leri düz liste
  const tumKategoriler: { id: number; ad: string }[] = []
  kategoriler.forEach((k) => {
    tumKategoriler.push({ id: k.id, ad: k.ad })
    k.altlar?.forEach((a) => tumKategoriler.push({ id: a.id, ad: a.ad }))
  })

  const filtreliHizmetler = aktifKategori === null
    ? hizmetler
    : hizmetler.filter((h) => h.hizmetKategorisiId === aktifKategori)

  const aktifKampanyalar = filtreliHizmetler.filter(
    (h) => h.indirimYuzde && h.indirimYuzde > 0 && (h.indirimBitis === null || new Date(h.indirimBitis) >= now)
  )
  const pasifKampanyalar = filtreliHizmetler.filter(
    (h) => h.indirimYuzde && h.indirimYuzde > 0 && h.indirimBitis && new Date(h.indirimBitis) < now
  )
  const kampanyasizHizmetler = filtreliHizmetler.filter(
    (h) => !h.indirimYuzde || h.indirimYuzde <= 0
  )

  function formAc(id: number) {
    setAcikForm(id)
    if (!formlar[id]) {
      setFormlar((prev) => ({ ...prev, [id]: { indirimYuzde: '', indirimBitis: '' } }))
    }
  }

  async function indirimKaydet(hizmet: Hizmet) {
    const form = formlar[hizmet.id]
    if (!form) return
    const yuzde = parseInt(form.indirimYuzde)
    if (!yuzde || yuzde < 1 || yuzde > 99) {
      toast('Geçerli bir indirim yüzdesi girin (1-99)', 'error')
      return
    }

    setYukleniyor(hizmet.id)
    try {
      const body = {
        ad: hizmet.ad,
        fiyat: hizmet.fiyat,
        indirimYuzde: yuzde,
        indirimBitis: form.indirimBitis || null,
      }
      const res = await fetch(`/api/hizmet?id=${hizmet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        const guncellenen = data.data ?? data
        setHizmetler((prev) =>
          prev.map((h) =>
            h.id === hizmet.id
              ? { ...h, indirimYuzde: guncellenen.indirimYuzde, indirimBitis: guncellenen.indirimBitis ?? null }
              : h
          )
        )
        setAcikForm(null)
        toast('Kampanya oluşturuldu!', 'success')
      } else {
        const d = await res.json()
        toast(d.error || 'Bir hata oluştu.', 'error')
      }
    } finally {
      setYukleniyor(null)
    }
  }

  async function indirimKaldir(hizmet: Hizmet) {
    setYukleniyor(hizmet.id)
    try {
      const body = {
        ad: hizmet.ad,
        fiyat: hizmet.fiyat,
        indirimYuzde: null,
        indirimBitis: null,
      }
      const res = await fetch(`/api/hizmet?id=${hizmet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setHizmetler((prev) =>
          prev.map((h) =>
            h.id === hizmet.id ? { ...h, indirimYuzde: null, indirimBitis: null } : h
          )
        )
        toast('Kampanya kaldırıldı.', 'success')
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setYukleniyor(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Kampanyalar</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {aktifKampanyalar.length} aktif kampanya
          </p>
        </div>
      </div>

      {/* Kategori Tab Bar */}
      {tumKategoriler.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setAktifKategori(null)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              aktifKategori === null
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Tümü ({hizmetler.length})
          </button>
          {tumKategoriler.map((k) => {
            const sayac = hizmetler.filter((h) => h.hizmetKategorisiId === k.id).length
            return (
              <button
                key={k.id}
                onClick={() => setAktifKategori(k.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  aktifKategori === k.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {k.ad} ({sayac})
              </button>
            )
          })}
        </div>
      )}

      {/* Bilgi Kutusu */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-indigo-800 mb-1">Kampanya Nasıl Çalışır?</p>
            <p className="text-sm text-indigo-700">
              Hizmetlerinize indirim yüzdesi ve bitiş tarihi atayarak kampanya oluşturabilirsiniz.
              Aktif kampanyalar müşteri vitrininde öne çıkar ve anasayfada görünür.
            </p>
          </div>
        </div>
      </div>

      {/* Aktif Kampanyalar */}
      {aktifKampanyalar.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Aktif Kampanyalar</h2>
          <div className="space-y-3">
            {aktifKampanyalar.map((h) => {
              const indirimliF = h.fiyat * (1 - (h.indirimYuzde! / 100))
              const kalanGun = kalanGunHesapla(h.indirimBitis)
              return (
                <div key={h.id} className="bg-white rounded-xl border border-emerald-200 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    🏷️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{h.ad}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-slate-400 line-through">{formatFiyat(h.fiyat)}</span>
                      <span className="text-sm font-bold text-emerald-600">{formatFiyat(indirimliF)}</span>
                      <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                        %{h.indirimYuzde} indirim
                      </span>
                    </div>
                    {kalanGun !== null && kalanGun >= 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        {kalanGun === 0 ? 'Bugün bitiyor' : `${kalanGun} gün kaldı`}
                      </p>
                    )}
                    {kalanGun === null && (
                      <p className="text-xs text-emerald-600 mt-1 font-medium">Süresiz kampanya</p>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => indirimKaldir(h)}
                    loading={yukleniyor === h.id}
                  >
                    Kaldır
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sona Eren Kampanyalar */}
      {pasifKampanyalar.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Sona Eren Kampanyalar</h2>
          <div className="space-y-3">
            {pasifKampanyalar.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 opacity-60">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  ⏰
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-600">{h.ad}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    %{h.indirimYuzde} indirim • {h.indirimBitis ? new Date(h.indirimBitis).toLocaleDateString('tr-TR') : ''} tarihinde sona erdi
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => formAc(h.id)}
                >
                  Yenile
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kampanyasız Hizmetler */}
      <div>
        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
          Hizmetler
          <span className="ml-2 text-xs font-normal text-slate-400">— kampanya eklemek için İndirim Ekle'ye tıklayın</span>
        </h2>
        {kampanyasizHizmetler.length === 0 && aktifKampanyalar.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 text-center py-12">
            <p className="text-4xl mb-3">🛠</p>
            <p className="font-semibold text-slate-600 mb-1">Henüz hizmet yok</p>
            <p className="text-slate-400 text-sm mb-4">Önce hizmet eklemeniz gerekiyor.</p>
            <a
              href="/isletme/hizmetler"
              className="inline-flex items-center gap-2 h-9 px-5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Hizmetlere Git
            </a>
          </div>
        ) : kampanyasizHizmetler.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Tüm hizmetlerde aktif kampanya var.</p>
        ) : (
          <div className="space-y-3">
            {kampanyasizHizmetler.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{h.ad}</p>
                    <p className="text-sm font-bold text-indigo-600 mt-0.5">{formatFiyat(h.fiyat)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => formAc(h.id)}
                    variant={acikForm === h.id ? 'secondary' : 'primary'}
                  >
                    {acikForm === h.id ? 'İptal' : '+ İndirim Ekle'}
                  </Button>
                </div>

                {acikForm === h.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">İndirim Yüzdesi (%)</label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          placeholder="20"
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          value={formlar[h.id]?.indirimYuzde ?? ''}
                          onChange={(e) =>
                            setFormlar((prev) => ({
                              ...prev,
                              [h.id]: { ...prev[h.id], indirimYuzde: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Bitiş Tarihi (opsiyonel)</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          value={formlar[h.id]?.indirimBitis ?? ''}
                          onChange={(e) =>
                            setFormlar((prev) => ({
                              ...prev,
                              [h.id]: { ...prev[h.id], indirimBitis: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                    {formlar[h.id]?.indirimYuzde && parseInt(formlar[h.id].indirimYuzde) > 0 && (
                      <p className="text-xs text-emerald-600">
                        İndirimli fiyat: {formatFiyat(h.fiyat * (1 - parseInt(formlar[h.id].indirimYuzde) / 100))}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => indirimKaydet(h)}
                        loading={yukleniyor === h.id}
                        className="flex-1"
                      >
                        Kampanya Oluştur
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setAcikForm(null)}
                        className="flex-1"
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
