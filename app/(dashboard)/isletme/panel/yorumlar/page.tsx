'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'
import { YorumBildirButon } from './YorumBildirButon'

type Sekme = 'tumu' | 'cevaplanmamis' | 'cevaplanmis'

interface Yorum {
  id: number
  puan: number
  yorum: string | null
  musteriAd: string
  yanitlar: string | null
  bildirildi: boolean
  olusturmaT: string
}

function maskeAd(ad: string): string {
  return ad
    .split(' ')
    .map((kelime) => kelime.length > 1 ? kelime[0] + '*'.repeat(kelime.length - 1) : kelime)
    .join(' ')
}

function YanitFormu({ yorumId, mevcutYanit, onKayit }: { yorumId: number; mevcutYanit: string | null; onKayit: (yanit: string | null) => void }) {
  const [acik, setAcik] = useState(false)
  const [yanit, setYanit] = useState(mevcutYanit || '')
  const [yukleniyor, setYukleniyor] = useState(false)

  async function kaydet() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/yorum/${yorumId}/yanit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yanit: yanit.trim() || null }),
      })
      if (res.ok) {
        onKayit(yanit.trim() || null)
        setAcik(false)
      } else {
        alert('Yanıt kaydedilemedi.')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  if (!acik) {
    return (
      <button
        onClick={() => setAcik(true)}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors mt-2"
      >
        {mevcutYanit ? '✏️ Yanıtı Düzenle' : '💬 Yanıt Yaz'}
      </button>
    )
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <textarea
        value={yanit}
        onChange={(e) => setYanit(e.target.value)}
        placeholder="Müşteriye yanıtınızı yazın..."
        rows={3}
        maxLength={1000}
        className="w-full text-sm border border-[var(--color-border)] rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <div className="flex gap-2">
        <button
          onClick={kaydet}
          disabled={yukleniyor}
          className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <button
          onClick={() => { setAcik(false); setYanit(mevcutYanit || '') }}
          className="px-4 py-1.5 text-xs font-medium border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
      </div>
    </div>
  )
}

function YorumKart({ yorum: baslangic }: { yorum: Yorum }) {
  const [yorum, setYorum] = useState(baslangic)

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-medium text-sm">{maskeAd(yorum.musteriAd)}</p>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {formatTarih(yorum.olusturmaT)}
              </span>
              {yorum.yanitlar ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
                  ✓ Cevaplanmış
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                  ○ Cevaplanmamış
                </span>
              )}
            </div>
            {yorum.yorum && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{yorum.yorum}</p>
            )}
            {yorum.yanitlar && (
              <div className="mt-2 pl-3 border-l-2 border-indigo-200">
                <p className="text-xs font-semibold text-indigo-600 mb-0.5">İşletme Yanıtı</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{yorum.yanitlar}</p>
              </div>
            )}
            <YanitFormu
              yorumId={yorum.id}
              mevcutYanit={yorum.yanitlar}
              onKayit={(yanit) => setYorum((prev) => ({ ...prev, yanitlar: yanit }))}
            />
            <div className="mt-3">
              <YorumBildirButon yorumId={yorum.id} baslangicBildirildi={yorum.bildirildi} />
            </div>
          </div>
          <YildizPuan puan={yorum.puan} boyut="sm" />
        </div>
      </CardBody>
    </Card>
  )
}

export default function YorumlarSayfasi() {
  const [yorumlar, setYorumlar] = useState<Yorum[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [sekme, setSekme] = useState<Sekme>('tumu')

  useEffect(() => {
    fetch('/api/yorumlar-isletme')
      .then((r) => r.json())
      .then((d) => setYorumlar(d.yorumlar || []))
      .finally(() => setYukleniyor(false))
  }, [])

  const filtreli = yorumlar.filter((y) => {
    if (sekme === 'cevaplanmis') return !!y.yanitlar
    if (sekme === 'cevaplanmamis') return !y.yanitlar
    return true
  })

  const cevaplanmis = yorumlar.filter((y) => !!y.yanitlar).length
  const cevaplanmamis = yorumlar.filter((y) => !y.yanitlar).length

  const SEKMELER: { id: Sekme; label: string; sayi: number }[] = [
    { id: 'tumu', label: 'Tümü', sayi: yorumlar.length },
    { id: 'cevaplanmamis', label: 'Cevaplanmamış', sayi: cevaplanmamis },
    { id: 'cevaplanmis', label: 'Cevaplanmış', sayi: cevaplanmis },
  ]

  return (
    <div>
      <TopBar baslik="Yorumlar" aciklama={`Toplam ${yorumlar.length} yorum`} />

      {/* Sekmeler */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {SEKMELER.map((s) => (
          <button
            key={s.id}
            onClick={() => setSekme(s.id)}
            style={{
              padding: '7px 16px',
              borderRadius: 10,
              border: sekme === s.id ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              background: sekme === s.id ? 'var(--color-primary)' : 'white',
              color: sekme === s.id ? 'white' : 'var(--color-text)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            {s.label}
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 20, height: 20, borderRadius: 9999, fontSize: 11,
              background: sekme === s.id ? 'rgba(255,255,255,0.25)' : 'var(--color-bg-muted)',
              color: sekme === s.id ? 'white' : 'var(--color-text-secondary)',
              fontWeight: 700, padding: '0 5px',
            }}>
              {s.sayi}
            </span>
          </button>
        ))}
      </div>

      {yukleniyor ? (
        <p className="text-center text-[var(--color-text-secondary)] py-16">Yükleniyor...</p>
      ) : filtreli.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)] py-16">
          {sekme === 'tumu' ? 'Henüz yorum yok.' : sekme === 'cevaplanmamis' ? 'Tüm yorumlar cevaplanmış! 🎉' : 'Henüz cevaplanmış yorum yok.'}
        </p>
      ) : (
        <div className="space-y-3">
          {filtreli.map((y) => (
            <YorumKart key={y.id} yorum={y} />
          ))}
        </div>
      )}
    </div>
  )
}
