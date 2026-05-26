'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { HizmetForm } from '@/components/dashboard/HizmetForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Card, CardBody } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { formatFiyat, formatSure } from '@/lib/utils'
import type { Hizmet } from '@/types'

interface AltKat { id: number; ad: string; sira: number }
interface UstKat { id: number; ad: string; sira: number; altlar: AltKat[] }

type HizmetEk = Hizmet & { hizmetKategorisiId?: number | null }

export default function HizmetlerSayfasi() {
  const [hizmetler, setHizmetler] = useState<HizmetEk[]>([])
  const [kategoriler, setKategoriler] = useState<UstKat[]>([])
  const [esnafId, setEsnafId] = useState(0)
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<HizmetEk | null>(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  // Kategori yönetimi state
  const [katModalAcik, setKatModalAcik] = useState(false)
  const [yeniKatAd, setYeniKatAd] = useState('')
  const [yeniAltKatAd, setYeniAltKatAd] = useState('')
  const [seciliUstId, setSeciliUstId] = useState<number | null>(null)
  const [katYukleniyor, setKatYukleniyor] = useState(false)
  const [katDuzenleId, setKatDuzenleId] = useState<number | null>(null)
  const [katDuzenleAd, setKatDuzenleAd] = useState('')

  async function veriCek() {
    try {
      const [hJson, kJson] = await Promise.all([
        fetch('/api/hizmet').then((r) => r.json()),
        fetch('/api/hizmet-kategori').then((r) => r.json()),
      ])
      const sonuc = hJson?.data ?? hJson
      setHizmetler(sonuc?.hizmetler || [])
      setEsnafId(sonuc?.esnafId || 0)
      setKategoriler((kJson?.data ?? kJson)?.kategoriler || [])
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => { veriCek() }, [])

  async function onKayit() {
    setModalAcik(false)
    setDuzenle(null)
    await veriCek()
  }

  async function sil(id: number) {
    await fetch(`/api/hizmet?id=${id}`, { method: 'DELETE' })
    setHizmetler((prev) => prev.filter((h) => h.id !== id))
  }

  async function katEkle(ustId?: number) {
    const ad = ustId ? yeniAltKatAd.trim() : yeniKatAd.trim()
    if (!ad) return
    setKatYukleniyor(true)
    try {
      const res = await fetch('/api/hizmet-kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad, ustId: ustId ?? null }),
      })
      const d = await res.json()
      const yeni = d?.data?.kategori ?? d?.kategori
      if (!yeni) return
      if (ustId) {
        setKategoriler((prev) => prev.map((k) => k.id === ustId ? { ...k, altlar: [...k.altlar, { id: yeni.id, ad: yeni.ad, sira: yeni.sira }] } : k))
        setYeniAltKatAd('')
      } else {
        setKategoriler((prev) => [...prev, { id: yeni.id, ad: yeni.ad, sira: yeni.sira, altlar: [] }])
        setYeniKatAd('')
      }
    } finally {
      setKatYukleniyor(false)
    }
  }

  async function katSil(id: number) {
    await fetch(`/api/hizmet-kategori?id=${id}`, { method: 'DELETE' })
    setKategoriler((prev) => prev
      .filter((k) => k.id !== id)
      .map((k) => ({ ...k, altlar: k.altlar.filter((a) => a.id !== id) }))
    )
  }

  async function katGuncelle(id: number) {
    const ad = katDuzenleAd.trim()
    if (!ad) return
    setKatYukleniyor(true)
    try {
      await fetch(`/api/hizmet-kategori/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad }),
      })
      setKategoriler((prev) => prev.map((k) => {
        if (k.id === id) return { ...k, ad }
        return { ...k, altlar: k.altlar.map((a) => a.id === id ? { ...a, ad } : a) }
      }))
      setKatDuzenleId(null)
      setKatDuzenleAd('')
    } finally {
      setKatYukleniyor(false)
    }
  }

  // Hizmetleri kategoriye göre grupla
  const gruplar: { kat: UstKat | null; hizmetler: HizmetEk[] }[] = []
  const kullanilmis = new Set<number>()

  for (const kat of kategoriler) {
    const katIds = [kat.id, ...kat.altlar.map((a) => a.id)]
    const gruphizmetler = hizmetler.filter((h) => h.hizmetKategorisiId && katIds.includes(h.hizmetKategorisiId))
    gruphizmetler.forEach((h) => kullanilmis.add(h.id))
    gruplar.push({ kat, hizmetler: gruphizmetler })
  }
  const kategorisiz = hizmetler.filter((h) => !kullanilmis.has(h.id))
  if (kategorisiz.length > 0) gruplar.push({ kat: null, hizmetler: kategorisiz })

  // Tüm kategoriler (üst + alt) dropdown için
  const tumKategoriler = kategoriler.map((k) => ({ id: k.id, ad: k.ad, altlar: k.altlar }))

  return (
    <div>
      <TopBar
        baslik="Hizmetler"
        aciklama="Sunduğun hizmetleri ve fiyatları yönet"
        eylemler={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setKatModalAcik(true)}>
              🗂 Kategoriler
            </Button>
            <Button onClick={() => { setDuzenle(null); setModalAcik(true) }}>
              + Hizmet Ekle
            </Button>
          </div>
        }
      />

      {yukleniyor ? (
        <div className="py-16 flex justify-center"><Loader /></div>
      ) : hizmetler.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <p className="text-4xl mb-3">🛠</p>
          <p className="font-medium mb-1">Henüz hizmet eklenmedi</p>
          <p className="text-sm">İlk hizmetini ekleyerek başla.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {gruplar.map(({ kat, hizmetler: gh }) => (
            <div key={kat?.id ?? 'kategorisiz'}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {kat ? kat.ad : 'Kategorisiz'}
                </h3>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                <span className="text-xs text-[var(--color-text-secondary)]">{gh.length} hizmet</span>
              </div>
              <div className="space-y-3">
                {gh.map((h) => {
                  const altKat = kategoriler.flatMap((k) => k.altlar).find((a) => a.id === h.hizmetKategorisiId)
                  return (
                    <Card key={h.id}>
                      <CardBody className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium truncate">{h.ad}</p>
                            {altKat && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                                {altKat.ad}
                              </span>
                            )}
                          </div>
                          {h.aciklama && (
                            <p className="text-sm text-[var(--color-text-secondary)] truncate">{h.aciklama}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-semibold text-[var(--color-primary)]">{formatFiyat(Number(h.fiyat))}</span>
                            {h.sure && <span className="text-xs text-[var(--color-text-secondary)]">⏱ {formatSure(h.sure)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setDuzenle(h); setModalAcik(true) }}
                          >
                            Düzenle
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => sil(h.id)}>
                            Sil
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hizmet Ekle/Düzenle Modal */}
      <Modal
        acik={modalAcik}
        kapat={() => { setModalAcik(false); setDuzenle(null) }}
        baslik={duzenle ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
      >
        <HizmetForm
          esnafId={esnafId}
          hizmet={duzenle || undefined}
          kategoriler={tumKategoriler}
          onKayit={onKayit}
          onIptal={() => { setModalAcik(false); setDuzenle(null) }}
        />
      </Modal>

      {/* Kategori Yönetimi Modal */}
      <Modal
        acik={katModalAcik}
        kapat={() => { setKatModalAcik(false); setKatDuzenleId(null); setSeciliUstId(null) }}
        baslik="Kategori Yönetimi"
      >
        <div className="space-y-5">
          {/* Yeni üst kategori ekleme */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Yeni Kategori Ekle</p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white transition-all"
                placeholder="ör. Saç Bakımı, Tırnak, Masaj..."
                value={yeniKatAd}
                onChange={(e) => setYeniKatAd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && katEkle()}
              />
              <button
                onClick={() => katEkle()}
                disabled={katYukleniyor || !yeniKatAd.trim()}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}
              >
                {katYukleniyor ? '...' : 'Ekle'}
              </button>
            </div>
          </div>

          {/* Kategori listesi */}
          {kategoriler.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">Henüz kategori yok</p>
                <p className="text-xs text-slate-400 mt-0.5">Yukarıdan ilk kategorini ekleyerek başla</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kategoriler <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-md font-bold">{kategoriler.length}</span>
              </p>
              {kategoriler.map((k) => (
                <div key={k.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Üst kategori satırı */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    {katDuzenleId === k.id ? (
                      <div className="flex gap-2 flex-1 items-center">
                        <input
                          autoFocus
                          className="flex-1 px-3 py-1.5 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          value={katDuzenleAd}
                          onChange={(e) => setKatDuzenleAd(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') katGuncelle(k.id); if (e.key === 'Escape') setKatDuzenleId(null) }}
                        />
                        <button onClick={() => katGuncelle(k.id)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">Kaydet</button>
                        <button onClick={() => setKatDuzenleId(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">İptal</button>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold text-sm text-slate-800 flex-1">{k.ad}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setKatDuzenleId(k.id); setKatDuzenleAd(k.ad) }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Düzenle"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => katSil(k.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Sil"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Alt kategoriler */}
                  {(k.altlar.length > 0 || seciliUstId === k.id) && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 space-y-1">
                      {k.altlar.map((a) => (
                        <div key={a.id} className="flex items-center gap-2 py-1.5 pl-3 group">
                          <div className="w-1 h-4 rounded-full bg-indigo-200 shrink-0" />
                          {katDuzenleId === a.id ? (
                            <div className="flex gap-2 flex-1 items-center">
                              <input
                                autoFocus
                                className="flex-1 px-2.5 py-1.5 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                value={katDuzenleAd}
                                onChange={(e) => setKatDuzenleAd(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') katGuncelle(a.id); if (e.key === 'Escape') setKatDuzenleId(null) }}
                              />
                              <button onClick={() => katGuncelle(a.id)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">Kaydet</button>
                              <button onClick={() => setKatDuzenleId(null)} className="text-xs text-slate-400 hover:text-slate-600">İptal</button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm text-slate-600 flex-1">{a.ad}</span>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => { setKatDuzenleId(a.id); setKatDuzenleAd(a.ad) }}
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => katSil(a.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      {/* Alt kategori ekleme */}
                      {seciliUstId === k.id ? (
                        <div className="flex gap-2 py-1.5 pl-3 items-center">
                          <div className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
                          <input
                            autoFocus
                            className="flex-1 px-2.5 py-1.5 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            placeholder="Alt kategori adı..."
                            value={yeniAltKatAd}
                            onChange={(e) => setYeniAltKatAd(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && katEkle(k.id)}
                          />
                          <button
                            onClick={() => katEkle(k.id)}
                            disabled={katYukleniyor || !yeniAltKatAd.trim()}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                          >
                            Ekle
                          </button>
                          <button onClick={() => { setSeciliUstId(null); setYeniAltKatAd('') }} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">İptal</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSeciliUstId(k.id)}
                          className="flex items-center gap-1.5 py-1.5 pl-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Alt Kategori Ekle
                        </button>
                      )}
                    </div>
                  )}

                  {/* Alt kategori ekle butonu — alt kategori yoksa */}
                  {k.altlar.length === 0 && seciliUstId !== k.id && (
                    <div className="border-t border-slate-100 px-4 py-2">
                      <button
                        onClick={() => setSeciliUstId(k.id)}
                        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-600 font-medium transition-colors py-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Alt Kategori Ekle
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
