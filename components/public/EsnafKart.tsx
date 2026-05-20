'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { ortalamaPuan, isletmeAcikMi, formatFiyat } from '@/lib/utils'
import { FavoriButon } from './FavoriButon'
import type { Esnaf } from '@/types'

interface EsnafKartProps {
  esnaf: Esnaf
  favoriMi?: boolean
  authenticated?: boolean
}

export function EsnafKart({ esnaf, favoriMi = false, authenticated = false }: EsnafKartProps) {
  const puan = ortalamaPuan(esnaf.yorumlar || [])
  const acik = isletmeAcikMi(esnaf.calismaS as Record<string, { acik: string; kapali: string; kapali_gun?: boolean }> | null)
  const minFiyat = esnaf.hizmetler?.length
    ? Math.min(...esnaf.hizmetler.map((h) => Number(h.fiyat)))
    : null

  return (
    <Link
      href={`/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`}
      className="group block"
      style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <div className="absolute inset-0" style={{ background: 'var(--color-bg-muted)' }}>
          {esnaf.kapakFoto ? (
            <Image
              src={esnaf.kapakFoto}
              alt={esnaf.isletmeAdi}
              fill
              className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center group-hover:scale-[1.03] transition-transform duration-700"
              style={{
                background: `linear-gradient(145deg, ${esnaf.kategori.renk}22 0%, ${esnaf.kategori.renk}55 50%, ${esnaf.kategori.renk}33 100%)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Arka plan desen */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(circle at 30% 30%, ${esnaf.kategori.renk}30 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${esnaf.kategori.renk}20 0%, transparent 50%)`,
              }} />
              {/* İkon */}
              <div style={{
                position: 'relative',
                width: 72, height: 72,
                borderRadius: '50%',
                background: `${esnaf.kategori.renk}22`,
                border: `2px solid ${esnaf.kategori.renk}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 24px ${esnaf.kategori.renk}30`,
              }}>
                <span style={{ fontSize: 36, lineHeight: 1 }}>
                  {esnaf.kategori.ikon}
                </span>
              </div>
              <span style={{
                position: 'relative',
                marginTop: 10,
                fontSize: 11,
                fontWeight: 700,
                color: `${esnaf.kategori.renk}cc`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {esnaf.kategori.ad}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, transparent)' }} />

        {/* Kategori badge */}
        <div className="absolute" style={{ top: 12, left: 12, zIndex: 10 }}>
          <Badge
            className="text-white backdrop-blur-sm"
            style={{ backgroundColor: `${esnaf.kategori.renk}dd`, fontSize: '10px', padding: '4px 10px', borderRadius: '9999px', boxShadow: 'var(--shadow-sm)' }}
          >
            {esnaf.kategori.ikon} <span style={{ marginLeft: 4, fontWeight: 500 }}>{esnaf.kategori.ad}</span>
          </Badge>
        </div>

        {/* Favori + Açık/Kapalı */}
        <div className="absolute" style={{ top: 10, right: 10, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <FavoriButon esnafId={esnaf.id} baslangicFavori={favoriMi} authenticated={authenticated} />
          <Badge
            variant={acik ? 'success' : 'default'}
            style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '9999px', boxShadow: 'var(--shadow-sm)', fontWeight: 600, letterSpacing: '0.02em' }}
          >
            {acik ? '• Açık' : 'Kapalı'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 16px 20px' }}>
        <h3
          className="font-display line-clamp-2"
          style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.4, marginBottom: '8px' }}
        >
          {esnaf.isletmeAdi}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
          📍 {esnaf.ilce}, {esnaf.sehir}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <YildizPuan puan={puan} boyut="sm" />
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            ({esnaf.yorumlar?.length || 0})
          </span>
        </div>

        {minFiyat !== null && (
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
              {formatFiyat(minFiyat)}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginLeft: '6px' }}>
              &apos;den başlayan
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
