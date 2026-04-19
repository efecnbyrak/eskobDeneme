'use client'

import { useState, Suspense } from 'react'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useEsnaf } from '@/hooks/useEsnaf'
import { useDebounce } from '@/hooks/useDebounce'
import { KATEGORILER, SEHIRLER } from '@/lib/constants'

export default function AraSayfasi() {
  const [sehir, setSehir] = useState('')
  const [kategori, setKategori] = useState('')
  const [arama, setArama] = useState('')
  const [sayfa, setSayfa] = useState(1)

  const debouncedArama = useDebounce(arama, 400)
  const { esnaflar, yukleniyor, toplamSayfa } = useEsnaf({ sehir, kategori, arama: debouncedArama, sayfa })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
        Esnaf Ara
      </h1>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          placeholder="Esnaf adı veya hizmet ara..."
          className="flex-1 px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-full)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
          value={arama}
          onChange={(e) => { setArama(e.target.value); setSayfa(1) }}
        />
        <select
          className="px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-full)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
          value={sehir}
          onChange={(e) => { setSehir(e.target.value); setSayfa(1) }}
        >
          <option value="">Tüm Şehirler</option>
          {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-full)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
          value={kategori}
          onChange={(e) => { setKategori(e.target.value); setSayfa(1) }}
        >
          <option value="">Tüm Kategoriler</option>
          {KATEGORILER.map((k) => <option key={k.slug} value={k.slug}>{k.ikon} {k.ad}</option>)}
        </select>
      </div>

      {/* Sonuçlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {yukleniyor
          ? Array.from({ length: 6 }).map((_, i) => <EsnafKartSkeleton key={i} />)
          : esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
        }
      </div>

      {!yukleniyor && esnaflar.length === 0 && (
        <p className="text-center text-[var(--color-text-secondary)] py-16">
          Arama kriterlerinize uygun esnaf bulunamadı.
        </p>
      )}

      {/* Sayfalama */}
      {toplamSayfa > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="secondary"
            size="sm"
            disabled={sayfa === 1}
            onClick={() => setSayfa((p) => p - 1)}
          >
            ← Önceki
          </Button>
          <span className="flex items-center px-4 text-sm text-[var(--color-text-secondary)]">
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
