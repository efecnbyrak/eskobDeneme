'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { HizmetForm } from '@/components/dashboard/HizmetForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Card, CardBody } from '@/components/ui/Card'
import { formatFiyat, formatSure } from '@/lib/utils'
import type { Hizmet } from '@/types'

export default function HizmetlerSayfasi() {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([])
  const [esnafId, setEsnafId] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<Hizmet | null>(null)

  useEffect(() => {
    fetch('/api/hizmet')
      .then((r) => r.json())
      .then((data) => {
        setHizmetler(data.hizmetler || [])
        setEsnafId(data.esnafId || '')
      })
  }, [])

  function onKayit(hizmet: Hizmet) {
    setHizmetler((prev) =>
      duzenle ? prev.map((h) => (h.id === hizmet.id ? hizmet : h)) : [...prev, hizmet]
    )
    setModalAcik(false)
    setDuzenle(null)
  }

  async function sil(id: string) {
    await fetch(`/api/hizmet?id=${id}`, { method: 'DELETE' })
    setHizmetler((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div>
      <TopBar
        baslik="Hizmetler"
        aciklama="Sunduğun hizmetleri ve fiyatları yönet"
        eylemler={
          <Button onClick={() => { setDuzenle(null); setModalAcik(true) }}>
            + Hizmet Ekle
          </Button>
        }
      />

      {hizmetler.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <p className="text-4xl mb-3">🛠</p>
          <p className="font-medium mb-1">Henüz hizmet eklenmedi</p>
          <p className="text-sm">İlk hizmetini ekleyerek başla.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hizmetler.map((h) => (
            <Card key={h.id}>
              <CardBody className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{h.ad}</p>
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
