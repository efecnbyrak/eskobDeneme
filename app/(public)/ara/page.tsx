'use client'

import { useState } from 'react'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useEsnaf } from '@/hooks/useEsnaf'
import { useDebounce } from '@/hooks/useDebounce'
import { KATEGORILER, SEHIRLER } from '@/lib/constants'

const inputCls =
  'px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] bg-white transition-all duration-200 placeholder:text-[var(--color-text-secondary)]'

export default function AraSayfasi() {
  const [sehir, setSehir] = useState('')
  const [kategori, setKategori] = useState('')
  const [arama, setArama] = useState('')
  const [sayfa, setSayfa] = useState(1)

  const debouncedArama = useDebounce(arama, 400)
  const { esnaflar, yukleniyor, toplamSayfa } = useEsnaf({ sehir, kategori, arama: debouncedArama, sayfa })

  const filtreAktif = sehir || kategori || arama

  function filtreleriTemizle() {
    setSehir('')
    setKategori('')
    setArama('')
    setSayfa(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Esnaf Ara</h1>
        <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
          Yakınındaki işletmeleri keşfet, randevu al
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 mb-8 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Esnaf adı veya hizmet ara..."
              className={`${inputCls} w-full pl-10`}
              value={arama}
              onChange={(e) => { setArama(e.target.value); setSayfa(1) }}
            />
          </div>
          <select
            className={`${inputCls} sm:w-44`}
            value={sehir}
            onChange={(e) => { setSehir(e.target.value); setSayfa(1) }}
          >
            <option value="">Tüm Şehirler</option>
            {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className={`${inputCls} sm:w-52`}
            value={kategori}
            onChange={(e) => { setKategori(e.target.value); setSayfa(1) }}
          >
            <option value="">Tüm Kategoriler</option>
            {KATEGORILER.map((k) => <option key={k.slug} value={k.slug}>{k.ikon} {k.ad}</option>)}
          </select>
          {filtreAktif && (
            <Button variant="ghost" size="sm" onClick={filtreleriTemizle} className="shrink-0">
              Temizle ✕
            </Button>
          )}
        </div>
      </div>

      {/* Sonuç sayısı */}
      {!yukleniyor && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          {esnaflar.length > 0
            ? `${esnaflar.length} işletme bulundu`
            : null}
        </p>
      )}

      {/* Sonuçlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {yukleniyor
          ? Array.from({ length: 6 }).map((_, i) => <EsnafKartSkeleton key={i} />)
          : esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
        }
      </div>

      {/* Boş durum */}
      {!yukleniyor && esnaflar.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold font-display text-lg mb-2">Sonuç bulunamadı</h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            Arama kriterlerinize uygun esnaf bulunamadı.
          </p>
          {filtreAktif && (
            <Button variant="secondary" size="sm" onClick={filtreleriTemizle}>
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}

      {/* Sayfalama */}
      {toplamSayfa > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <Button
            variant="secondary"
            size="sm"
            disabled={sayfa === 1}
            onClick={() => setSayfa((p) => p - 1)}
          >
            ← Önceki
          </Button>
          <span className="text-sm text-[var(--color-text-secondary)] px-2">
            {sayfa} / {toplamSayfa}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={sayfa === toplamSayfa}
            onClick={() => setSayfa((p) => p + 1)}
          >
            Sonraki →
          </Button>
        </div>
      )}
    </div>
  )
}
