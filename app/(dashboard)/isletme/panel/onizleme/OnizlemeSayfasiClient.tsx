'use client'

import { useState } from 'react'
import Link from 'next/link'

type Mod = 'masaustu' | 'tablet' | 'telefon'

const MODLAR: { id: Mod; label: string; ikon: string; genislik: number | string; yukseklik: number; cihazLabel: string }[] = [
  { id: 'masaustu', label: 'Bilgisayar', ikon: '🖥️', genislik: '100%', yukseklik: 600, cihazLabel: '16:9 Masaüstü/Laptop' },
  { id: 'tablet', label: 'Tablet', ikon: '⬛', genislik: 768, yukseklik: 1024, cihazLabel: '768 × 1024 Tablet' },
  { id: 'telefon', label: 'Telefon', ikon: '📱', genislik: 390, yukseklik: 844, cihazLabel: '390 × 844 Telefon' },
]

interface Props {
  sayfaUrl: string
  isletmeAdi: string
}

export function OnizlemeSayfasiClient({ sayfaUrl, isletmeAdi }: Props) {
  const [mod, setMod] = useState<Mod>('masaustu')

  const secilenMod = MODLAR.find((m) => m.id === mod)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 24px 0' }}>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
            Ön İzleme
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Müşteriler <strong>{isletmeAdi}</strong> sayfanızı bu şekilde görüyor
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href={sayfaUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 10,
              border: '1.5px solid var(--color-border)',
              background: 'white', color: 'var(--color-text)',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Yeni Sekmede Aç
          </Link>
          <Link
            href="/isletme/panel/vitrin"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 10,
              background: 'var(--color-primary)', color: 'white',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Vitrinini Düzenle
          </Link>
        </div>
      </div>

      {/* Bilgi banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', borderRadius: 10, marginBottom: 16,
        background: '#FFF8F0', border: '1px solid #FFD9B0',
        fontSize: 13, color: '#7A4A00',
      }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Aşağıdaki önizleme, müşterilerinizin gördüğü sayfayı yansıtır. Değişiklik yapmak için <strong style={{ marginLeft: 3 }}>Vitrinini Düzenle</strong> butonuna tıklayın.
      </div>

      {/* Mod Seçici */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginRight: 4 }}>Görünüm:</span>
        {MODLAR.map((m) => (
          <button
            key={m.id}
            onClick={() => setMod(m.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 10,
              border: mod === m.id ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              background: mod === m.id ? 'var(--color-primary)' : 'white',
              color: mod === m.id ? 'white' : 'var(--color-text)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 15 }}>{m.ikon}</span>
            {m.label}
          </button>
        ))}
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 4 }}>
          {secilenMod.cihazLabel}
        </span>
      </div>

      {/* iframe Container */}
      <div style={{
        flex: 1,
        border: '1.5px solid var(--color-border)',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        background: mod === 'masaustu' ? 'var(--color-bg-muted)' : '#E5E7EB',
        display: 'flex',
        alignItems: mod === 'masaustu' ? 'stretch' : 'flex-start',
        justifyContent: 'center',
        minHeight: 600,
        padding: mod === 'masaustu' ? 0 : '20px 20px 0',
        overflowY: mod === 'masaustu' ? 'hidden' : 'auto',
      }}>
        {mod === 'masaustu' ? (
          <iframe
            src={sayfaUrl}
            style={{ width: '100%', height: '100%', border: 'none', minHeight: 600, display: 'block' }}
            title={`${isletmeAdi} — Masaüstü Ön İzleme`}
          />
        ) : (
          <div style={{
            width: secilenMod.genislik,
            height: secilenMod.yukseklik,
            flexShrink: 0,
            borderRadius: mod === 'telefon' ? '24px 24px 0 0' : '12px 12px 0 0',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            border: mod === 'telefon' ? '4px solid #374151' : '2px solid #9CA3AF',
            background: 'white',
            position: 'relative',
          }}>
            {/* Telefon çentiği */}
            {mod === 'telefon' && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 100, height: 24, background: '#374151', borderRadius: '0 0 16px 16px',
                zIndex: 10,
              }} />
            )}
            <iframe
              src={sayfaUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
              title={`${isletmeAdi} — ${secilenMod.label} Ön İzleme`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
