'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Loader } from '@/components/ui/Loader'
import { formatFiyat } from '@/lib/utils'
import type { Hizmet } from '@/types'

interface HizmetWithIndirim extends Hizmet {
  indirimYuzde?: number | null
  indirimBaslangic?: string | null
  indirimBitis?: string | null
}

function KampanyaForm({
  hizmet,
  onKayit,
  onIptal,
}: {
  hizmet: HizmetWithIndirim
  onKayit: (h: HizmetWithIndirim) => void
  onIptal: () => void
}) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    indirimYuzde: hizmet.indirimYuzde ?? 0,
    indirimBaslangic: hizmet.indirimBaslangic ? hizmet.indirimBaslangic.slice(0, 10) : '',
    indirimBitis: hizmet.indirimBitis ? hizmet.indirimBitis.slice(0, 10) : '',
  })
  const [yukleniyor, setYukleniyor] = useState(false)

  async function kaydet() {
    if (form.indirimYuzde < 1 || form.indirimYuzde > 99) {
      toast('İndirim yüzdesi 1-99 arasında olmalıdır.', 'error')
      return
    }
    if (!form.indirimBaslangic || !form.indirimBitis) {
      toast('Başlangıç ve bitiş tarihi zorunludur.', 'error')
      return
    }
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/hizmet?id=${hizmet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: hizmet.ad,
          fiyat: hizmet.fiyat,
          sure: hizmet.sure ?? 60,
          aciklama: hizmet.aciklama ?? '',
          indirimYuzde: form.indirimYuzde,
          indirimBaslangic: form.indirimBaslangic,
          indirimBitis: form.indirimBitis,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        toast('Kampanya kaydedildi!', 'success')
        onKayit({ ...hizmet, ...form, ...(data.data ?? {}) })
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  async function kampanyaKaldir() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/hizmet?id=${hizmet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: hizmet.ad,
          fiyat: hizmet.fiyat,
          sure: hizmet.sure ?? 60,
          aciklama: hizmet.aciklama ?? '',
          indirimYuzde: null,
          indirimBaslangic: null,
          indirimBitis: null,
        }),
      })
      if (res.ok) {
        toast('Kampanya kaldırıldı.', 'success')
        onKayit({ ...hizmet, indirimYuzde: null, indirimBaslangic: null, indirimBitis: null })
      } else {
        toast('Bir hata oluştu.', 'error')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  const indirimliF = form.indirimYuzde > 0 ? Number(hizmet.fiyat) * (1 - form.indirimYuzde / 100) : null

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-[var(--color-border)]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">İndirim (%)</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            placeholder="20"
            value={form.indirimYuzde === 0 ? '' : form.indirimYuzde}
            onChange={(e) => setForm((p) => ({ ...p, indirimYuzde: Number(e.target.value) }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Başlangıç</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            type="date"
            value={form.indirimBaslangic}
            onChange={(e) => setForm((p) => ({ ...p, indirimBaslangic: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Bitiş</label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            type="date"
            value={form.indirimBitis}
            onChange={(e) => setForm((p) => ({ ...p, indirimBitis: e.target.value }))}
          />
        </div>
      </div>

      {indirimliF !== null && (
        <div className="flex items-center gap-3 text-sm bg-green-50 rounded-[var(--radius-md)] px-4 py-2.5">
          <span className="text-[var(--color-text-secondary)] line-through">{formatFiyat(Number(hizmet.fiyat))}</span>
          <span>→</span>
          <span className="font-bold text-green-700">{formatFiyat(indirimliF)}</span>
          <span className="text-green-600 text-xs font-medium">(%{form.indirimYuzde} indirim)</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={kaydet} loading={yukleniyor} size="sm" className="flex-1">Kampanyayı Kaydet</Button>
        {hizmet.indirimYuzde && (
          <Button variant="danger" size="sm" onClick={kampanyaKaldir} loading={yukleniyor}>Kaldır</Button>
        )}
        <Button variant="secondary" size="sm" onClick={onIptal}>İptal</Button>
      </div>
    </div>
  )
}

export default function KampanyalarSayfasi() {
  const [hizmetler, setHizmetler] = useState<HizmetWithIndirim[]>([])
  const [acikForm, setAcikForm] = useState<number | null>(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    fetch('/api/hizmet')
      .then((r) => r.json())
      .then((d) => setHizmetler(d.data?.hizmetler || []))
      .finally(() => setYukleniyor(false))
  }, [])

  const simdiki = new Date()

  const aktifKampanyaMi = (h: HizmetWithIndirim) => {
    if (!h.indirimYuzde || !h.indirimBitis) return false
    return new Date(h.indirimBitis) > simdiki
  }

  return (
    <div>
      <TopBar
        baslik="Kampanyalar"
        aciklama="Hizmetlerinize geçici indirim kampanyaları tanımlayın"
      />

      {yukleniyor ? (
        <div className="py-16 flex justify-center"><Loader /></div>
      ) : hizmetler.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="font-medium mb-1">Henüz hizmet eklenmedi</p>
          <p className="text-sm">Kampanya oluşturmak için önce hizmet eklemeniz gerekiyor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hizmetler.map((h) => {
            const aktif = aktifKampanyaMi(h)
            return (
              <Card key={h.id}>
                <CardBody>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{h.ad}</p>
                        {aktif && (
                          <Badge variant="success">Aktif Kampanya — %{h.indirimYuzde} indirim</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-[var(--color-primary)]">{formatFiyat(Number(h.fiyat))}</span>
                        {aktif && h.indirimYuzde && (
                          <span className="text-sm font-bold text-green-600">
                            → {formatFiyat(Number(h.fiyat) * (1 - h.indirimYuzde / 100))}
                          </span>
                        )}
                        {aktif && h.indirimBitis && (
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            Bitiş: {new Date(h.indirimBitis).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={acikForm === h.id ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setAcikForm(acikForm === h.id ? null : h.id)}
                    >
                      {acikForm === h.id ? 'Kapat' : aktif ? 'Düzenle' : '+ Kampanya Ekle'}
                    </Button>
                  </div>

                  {acikForm === h.id && (
                    <KampanyaForm
                      hizmet={h}
                      onKayit={(guncel) => {
                        setHizmetler((prev) => prev.map((x) => (x.id === guncel.id ? guncel : x)))
                        setAcikForm(null)
                      }}
                      onIptal={() => setAcikForm(null)}
                    />
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
