'use client'

import { useState } from 'react'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useEsnaf } from '@/hooks/useEsnaf'
import { useDebounce } from '@/hooks/useDebounce'
import { KATEGORILER, SEHIRLER } from '@/lib/constants'

const inputCls =
  'px-4 py-3.5 text-sm border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] bg-white transition-all duration-200 placeholder:text-[var(--color-text-secondary)] min-h-[48px]'

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
    <div className="container-main py-12 lg:py-16">
      {/* Başlık */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold font-display mb-3">Esnaf Ara</h1>
        <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
          Yakınındaki işletmeleri keşfet, randevu al
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 mb-8 shadow-[var(--shadow-card)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Esnaf adı veya hizmet ara..."
              className={`${inputCls} w-full pl-12`}
              value={arama}
              onChange={(e) => { setArama(e.target.value); setSayfa(1) }}
            />
          </div>
          <select
            className={`${inputCls} sm:w-48`}
            value={sehir}
            onChange={(e) => { setSehir(e.target.value); setSayfa(1) }}
          >
            <option value="">Tüm Şehirler</option>
            {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className={`${inputCls} sm:w-56`}
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
      {!yukleniyor && esnaflar.length > 0 && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 font-medium">
          {esnaflar.length} işletme bulundu
        </p>
      )}

      {/* Sonuçlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
        {yukleniyor
          ? Array.from({ length: 10 }).map((_, i) => <EsnafKartSkeleton key={i} />)
          : esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
        }
      </div>

      {/* Boş durum */}
      {!yukleniyor && esnaflar.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-6">🔍</div>
          <h3 className="font-bold font-display text-xl mb-3">Sonuç bulunamadı</h3>
          <p className="text-[var(--color-text-secondary)] text-base mb-8 leading-relaxed max-w-md mx-auto">
            Arama kriterlerinize uygun esnaf bulunamadı. Farklı filtreler deneyebilirsiniz.
          </p>
          {filtreAktif && (
            <Button variant="secondary" onClick={filtreleriTemizle}>
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}

      {/* Sayfalama */}
      {toplamSayfa > 1 && (
        <div className="flex justify-center items-center gap-4 mt-14">
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
