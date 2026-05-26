'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HizmetForm } from '@/components/dashboard/HizmetForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatFiyat, formatSure } from '@/lib/utils'
import type { Hizmet } from '@/types'

interface Kategori {
  id: number
  ad: string
  altlar?: { id: number; ad: string }[]
}

export default function HizmetlerSayfasi() {
  const router = useRouter()
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([])
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])
  const [esnafId, setEsnafId] = useState(0)
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<Hizmet | null>(null)
  const [silOnayId, setSilOnayId] = useState<number | null>(null)
  const [silYukleniyor, setSilYukleniyor] = useState(false)
  const [aktifKategori, setAktifKategori] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/hizmet')
      .then((r) => r.json())
      .then((json) => {
        const sonuc = json?.data ?? json
        setHizmetler(sonuc?.hizmetler || [])
        setEsnafId(sonuc?.esnafId || 0)
      })

    fetch('/api/hizmet-kategori')
      .then((r) => r.json())
      .then((json) => {
        const sonuc = json?.data ?? json
        setKategoriler(sonuc?.kategoriler ?? sonuc ?? [])
      })
  }, [])

  function onKayit(hizmet: Hizmet) {
    setHizmetler((prev) =>
      duzenle ? prev.map((h) => (h.id === hizmet.id ? hizmet : h)) : [...prev, hizmet]
    )
    setModalAcik(false)
    setDuzenle(null)
    router.refresh()
  }

  async function silOnayla() {
    if (!silOnayId) return
    setSilYukleniyor(true)
    await fetch(`/api/hizmet?id=${silOnayId}`, { method: 'DELETE' })
    setHizmetler((prev) => prev.filter((h) => h.id !== silOnayId))
    setSilYukleniyor(false)
    setSilOnayId(null)
  }

  // Tüm alt kategori id'lerini düz bir haritaya çevir
  const tumKategoriler: { id: number; ad: string }[] = []
  kategoriler.forEach((k) => {
    tumKategoriler.push({ id: k.id, ad: k.ad })
    k.altlar?.forEach((a) => tumKategoriler.push({ id: a.id, ad: a.ad }))
  })

  const filtreliHizmetler = aktifKategori === null
    ? hizmetler
    : hizmetler.filter((h) => (h as unknown as { hizmetKategorisiId?: number | null }).hizmetKategorisiId === aktifKategori)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Hizmetler</h1>
          <p className="text-slate-500 text-sm mt-0.5">Sunduğunuz hizmetleri ve fiyatları yönetin</p>
        </div>
        <Button onClick={() => { setDuzenle(null); setModalAcik(true) }}>
          + Hizmet Ekle
        </Button>
      </div>

      {/* Kategori Tab Bar */}
      {tumKategoriler.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setAktifKategori(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              aktifKategori === null
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            Tümü ({hizmetler.length})
          </button>
          {tumKategoriler.map((k) => {
            const sayac = hizmetler.filter(
              (h) => (h as unknown as { hizmetKategorisiId?: number | null }).hizmetKategorisiId === k.id
            ).length
            return (
              <button
                key={k.id}
                onClick={() => setAktifKategori(k.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  aktifKategori === k.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {k.ad} ({sayac})
              </button>
            )
          })}
        </div>
      )}

      {filtreliHizmetler.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <p className="text-5xl mb-4">🛠</p>
          <p className="font-semibold text-slate-700 mb-1">
            {aktifKategori !== null ? 'Bu kategoride hizmet yok' : 'Henüz hizmet eklenmedi'}
          </p>
          <p className="text-slate-400 text-sm mb-6">
            {aktifKategori !== null ? 'Başka bir kategori seçin veya hizmet ekleyin.' : 'İlk hizmetinizi ekleyerek başlayın.'}
          </p>
          {aktifKategori === null && (
            <Button onClick={() => { setDuzenle(null); setModalAcik(true) }}>
              + İlk Hizmeti Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtreliHizmetler.map((h) => (
            <div key={h.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:border-indigo-200 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {(h as unknown as { ikon?: string }).ikon && (
                    <span className="text-lg">{(h as unknown as { ikon?: string }).ikon}</span>
                  )}
                  <p className="font-semibold text-slate-800 truncate">{h.ad}</p>
                  {(h as unknown as { oneCikan?: boolean }).oneCikan && (
                    <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full">Öne Çıkan</span>
                  )}
                  {(h as unknown as { onlineOdeme?: boolean }).onlineOdeme && (
                    <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">Online Ödeme</span>
                  )}
                  {(h as unknown as { indirimYuzde?: number }).indirimYuzde! > 0 && (
                    <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                      %{(h as unknown as { indirimYuzde?: number }).indirimYuzde} İndirim
                    </span>
                  )}
                </div>
                {h.aciklama && (
                  <p className="text-sm text-slate-400 truncate mt-0.5">{h.aciklama}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-bold text-indigo-600">{formatFiyat(Number(h.fiyat))}</span>
                  {h.sure && <span className="text-xs text-slate-400">⏱ {formatSure(h.sure)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => { setDuzenle(h); setModalAcik(true) }}>
                  Düzenle
                </Button>
                <Button variant="danger" size="sm" onClick={() => setSilOnayId(h.id)}>
                  Sil
                </Button>
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
          kategoriler={kategoriler}
          onKayit={onKayit}
          onIptal={() => { setModalAcik(false); setDuzenle(null) }}
        />
      </Modal>

      {/* Silme Onay Modalı */}
      {silOnayId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => !silYukleniyor && setSilOnayId(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Hizmeti Sil</h3>
              <p className="text-sm text-slate-500">
                Bu hizmeti silmek istediğinizden emin misiniz?<br />Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSilOnayId(null)}
                disabled={silYukleniyor}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={silOnayla}
                disabled={silYukleniyor}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {silYukleniyor ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
