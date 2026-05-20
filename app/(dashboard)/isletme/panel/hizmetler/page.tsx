'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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

  useEffect(() => {
    Promise.all([
      fetch('/api/hizmet').then((r) => r.json()),
      fetch('/api/hizmet-kategori').then((r) => r.json()),
    ]).then(([hJson, kJson]) => {
      const sonuc = hJson?.data ?? hJson
      setHizmetler(sonuc?.hizmetler || [])
      setEsnafId(sonuc?.esnafId || 0)
      setKategoriler((kJson?.data ?? kJson)?.kategoriler || [])
    }).finally(() => setYukleniyor(false))
  }, [])

  function onKayit(hizmet: Hizmet) {
    setHizmetler((prev) =>
      duzenle ? prev.map((h) => (h.id === hizmet.id ? { ...hizmet } : h)) : [...prev, hizmet]
    )
    setModalAcik(false)
    setDuzenle(null)
    router.refresh()
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
        kapat={() => setKatModalAcik(false)}
        baslik="Kategori Yönetimi"
      >
        <div className="space-y-6">
          {/* Yeni üst kategori */}
          <div>
            <p className="text-sm font-semibold mb-2">Yeni Üst Kategori</p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="ör. Ana Yemek, Saç, Tırnak..."
                value={yeniKatAd}
                onChange={(e) => setYeniKatAd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && katEkle()}
              />
              <button
                onClick={() => katEkle()}
                disabled={katYukleniyor || !yeniKatAd.trim()}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Mevcut kategoriler */}
          {kategoriler.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Mevcut Kategoriler</p>
              {kategoriler.map((k) => (
                <div key={k.id} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                  {/* Üst kategori başlık */}
                  <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[var(--color-bg-muted)]">
                    {katDuzenleId === k.id ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          autoFocus
                          className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          value={katDuzenleAd}
                          onChange={(e) => setKatDuzenleAd(e.target.value)}
                        />
                        <button onClick={() => katGuncelle(k.id)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Kaydet</button>
                        <button onClick={() => setKatDuzenleId(null)} className="text-xs text-gray-400 hover:text-gray-600">İptal</button>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold text-sm">{k.ad}</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setKatDuzenleId(k.id); setKatDuzenleAd(k.ad) }} className="text-xs text-indigo-500 hover:text-indigo-700">✏️</button>
                          <button onClick={() => katSil(k.id)} className="text-xs text-red-400 hover:text-red-600">🗑</button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Alt kategoriler */}
                  <div className="px-4 py-2 space-y-1">
                    {k.altlar.map((a) => (
                      <div key={a.id} className="flex items-center justify-between gap-2 py-1.5 pl-4 border-l-2 border-indigo-200">
                        {katDuzenleId === a.id ? (
                          <div className="flex gap-2 flex-1">
                            <input
                              autoFocus
                              className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded-lg focus:outline-none"
                              value={katDuzenleAd}
                              onChange={(e) => setKatDuzenleAd(e.target.value)}
                            />
                            <button onClick={() => katGuncelle(a.id)} className="text-xs font-semibold text-indigo-600">Kaydet</button>
                            <button onClick={() => setKatDuzenleId(null)} className="text-xs text-gray-400">İptal</button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-[var(--color-text-secondary)]">↳ {a.ad}</span>
                            <div className="flex gap-2">
                              <button onClick={() => { setKatDuzenleId(a.id); setKatDuzenleAd(a.ad) }} className="text-xs text-indigo-500 hover:text-indigo-700">✏️</button>
                              <button onClick={() => katSil(a.id)} className="text-xs text-red-400 hover:text-red-600">🗑</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Alt kategori ekle */}
                    {seciliUstId === k.id ? (
                      <div className="flex gap-2 mt-2 pl-4">
                        <input
                          autoFocus
                          className="flex-1 px-2 py-1.5 text-sm border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          placeholder="Alt kategori adı..."
                          value={yeniAltKatAd}
                          onChange={(e) => setYeniAltKatAd(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && katEkle(k.id)}
                        />
                        <button
                          onClick={() => katEkle(k.id)}
                          disabled={katYukleniyor || !yeniAltKatAd.trim()}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Ekle
                        </button>
                        <button onClick={() => { setSeciliUstId(null); setYeniAltKatAd('') }} className="text-xs text-gray-400 hover:text-gray-600">İptal</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSeciliUstId(k.id)}
                        className="mt-1 pl-4 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                      >
                        + Alt Kategori Ekle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {kategoriler.length === 0 && (
            <p className="text-sm text-center text-[var(--color-text-secondary)] py-4">
              Henüz kategori yok. Üst kategori ekleyerek başlayın.
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}
