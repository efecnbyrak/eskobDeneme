'use client'

import Image from 'next/image'
import { useState } from 'react'

interface VitrinGaleriProps {
  fotograflar: string[]
  isletmeAdi: string
}

export function VitrinGaleri({ fotograflar, isletmeAdi }: VitrinGaleriProps) {
  const [acikIndex, setAcikIndex] = useState<number | null>(null)

  const gorsel = fotograflar.slice(0, 8)

  return (
    <>
      {/* Yatay scroll galeri */}
      <div
        style={{
          display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
          scrollbarWidth: 'none',
        }}
        className="no-scrollbar"
      >
        {gorsel.map((foto, i) => (
          <button
            key={i}
            onClick={() => setAcikIndex(i)}
            style={{
              flexShrink: 0, width: 180, height: 140,
              borderRadius: 14, overflow: 'hidden',
              border: '2px solid var(--color-border)',
              cursor: 'pointer', padding: 0, background: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.transform = 'scale(1.03)'
              el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.transform = 'scale(1)'
              el.style.boxShadow = 'none'
            }}
          >
            <Image src={foto} alt={`${isletmeAdi} - ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {acikIndex !== null && (
        <div
          onClick={() => setAcikIndex(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setAcikIndex(null) }}
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: 'white', fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {acikIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setAcikIndex(acikIndex - 1) }}
              style={{
                position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: 'white', fontSize: 22, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ‹
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', maxWidth: '90vw', maxHeight: '80vh',
              width: 900, height: 600, borderRadius: 16, overflow: 'hidden',
            }}
          >
            <Image
              src={gorsel[acikIndex]}
              alt={`${isletmeAdi} - ${acikIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {acikIndex < gorsel.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setAcikIndex(acikIndex + 1) }}
              style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: 'white', fontSize: 22, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ›
            </button>
          )}

          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {gorsel.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setAcikIndex(i) }}
                style={{
                  width: i === acikIndex ? 24 : 8, height: 8, borderRadius: 9999,
                  background: i === acikIndex ? 'white' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
