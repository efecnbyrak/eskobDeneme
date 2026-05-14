'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HizmetForm } from '@/components/dashboard/HizmetForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatFiyat, formatSure } from '@/lib/utils'
import type { Hizmet } from '@/types'

export default function HizmetlerSayfasi() {
  const router = useRouter()
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([])
  const [esnafId, setEsnafId] = useState(0)
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<Hizmet | null>(null)

  useEffect(() => {
    fetch('/api/hizmet')
      .then((r) => r.json())
      .then((data) => {
        setHizmetler(data.hizmetler || [])
        setEsnafId(data.esnafId || 0)
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

  async function sil(id: number) {
    await fetch(`/api/hizmet?id=${id}`, { method: 'DELETE' })
    setHizmetler((prev) => prev.filter((h) => h.id !== id))
  }

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

      {hizmetler.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <p className="text-5xl mb-4">🛠</p>
          <p className="font-semibold text-slate-700 mb-1">Henüz hizmet eklenmedi</p>
          <p className="text-slate-400 text-sm mb-6">İlk hizmetinizi ekleyerek başlayın.</p>
          <Button onClick={() => { setDuzenle(null); setModalAcik(true) }}>
            + İlk Hizmeti Ekle
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {hizmetler.map((h) => (
            <div key={h.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:border-indigo-200 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-800 truncate">{h.ad}</p>
                  {(h as { indirimYuzde?: number }).indirimYuzde && (h as { indirimYuzde?: number }).indirimYuzde! > 0 && (
                    <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                      %{(h as { indirimYuzde?: number }).indirimYuzde} İndirim
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
                <Button variant="danger" size="sm" onClick={() => sil(h.id)}>
                  Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        acik={modalAcik}
        kapat={() => { setModalAcik(false); setDuzenle(null) }}
        baslik={duzenle ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
      >
        <HizmetForm
          esnafId={esnafId}
          hizmet={duzenle || undefined}
          onKayit={onKayit}
          onIptal={() => { setModalAcik(false); setDuzenle(null) }}
        />
      </Modal>
    </div>
  )
}
