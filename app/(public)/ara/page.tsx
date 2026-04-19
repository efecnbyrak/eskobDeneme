'use client'

import { useState } from 'react'
import { EsnafKart } from '@/components/public/EsnafKart'
import { EsnafKartSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useEsnaf } from '@/hooks/useEsnaf'
import { useDebounce } from '@/hooks/useDebounce'
import { KATEGORILER, SEHIRLER } from '@/lib/constants'

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  padding: '0 16px',
  fontSize: '14px',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  background: 'white',
  outline: 'none',
  transition: 'all 0.2s',
}

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
    <div className="container-main" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '12px' }}>
          Esnaf Ara
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          Yakınındaki işletmeleri keşfet, randevu al
        </p>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', marginBottom: '32px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Esnaf adı veya hizmet ara..."
              style={{ ...inputStyle, paddingLeft: '48px' }}
              value={arama}
              onChange={(e) => { setArama(e.target.value); setSayfa(1) }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
            />
          </div>
          <select
            style={{ ...inputStyle, flex: '0 0 180px', cursor: 'pointer' }}
            value={sehir}
            onChange={(e) => { setSehir(e.target.value); setSayfa(1) }}
          >
            <option value="">Tüm Şehirler</option>
            {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            style={{ ...inputStyle, flex: '0 0 200px', cursor: 'pointer' }}
            value={kategori}
            onChange={(e) => { setKategori(e.target.value); setSayfa(1) }}
          >
            <option value="">Tüm Kategoriler</option>
            {KATEGORILER.map((k) => <option key={k.slug} value={k.slug}>{k.ikon} {k.ad}</option>)}
          </select>
          {filtreAktif && (
            <Button variant="ghost" size="sm" onClick={filtreleriTemizle} style={{ flexShrink: 0 }}>
              Temizle ✕
            </Button>
          )}
        </div>
      </div>

      {/* Result count */}
      {!yukleniyor && esnaflar.length > 0 && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', fontWeight: 500 }}>
          {esnaflar.length} işletme bulundu
        </p>
      )}

      {/* Results grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {yukleniyor
          ? Array.from({ length: 10 }).map((_, i) => <EsnafKartSkeleton key={i} />)
          : esnaflar.map((e) => <EsnafKart key={e.id} esnaf={e} />)
        }
      </div>

      {/* Empty state */}
      {!yukleniyor && esnaflar.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🔍</div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: '20px', marginBottom: '12px' }}>Sonuç bulunamadı</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 32px' }}>
            Arama kriterlerinize uygun esnaf bulunamadı. Farklı filtreler deneyebilirsiniz.
          </p>
          {filtreAktif && (
            <Button variant="secondary" onClick={filtreleriTemizle}>
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {toplamSayfa > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '56px' }}>
          <Button variant="secondary" size="sm" disabled={sayfa === 1} onClick={() => setSayfa((p) => p - 1)}>
            ← Önceki
          </Button>
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', padding: '0 8px' }}>
            {sayfa} / {toplamSayfa}
          </span>
          <Button variant="secondary" size="sm" disabled={sayfa === toplamSayfa} onClick={() => setSayfa((p) => p + 1)}>
            Sonraki →
          </Button>
        </div>
      )}
    </div>
  )
}
