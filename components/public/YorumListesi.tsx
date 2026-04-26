'use client'

import { useState } from 'react'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'
import type { Yorum } from '@/types'

interface YorumListesiProps {
  yorumlar: Yorum[]
}

const DEMO_YORUMLAR = [
  {
    id: -1,
    musteriAd: 'Ahmet Yılmaz',
    puan: 5,
    yorum: 'Harika bir deneyimdi, kesinlikle tavsiye ederim! Hizmet kalitesi beklentilerimin çok üzerindeydi.',
    yanitlar: null,
    onaylı: true,
    olusturmaT: '2026-03-15T10:30:00.000Z',
    esnafId: 0,
  },
  {
    id: -2,
    musteriAd: 'Zeynep Kaya',
    puan: 4,
    yorum: 'Hizmet kalitesi çok yüksek, personel güler yüzlüydü. Bir dahaki seferinde de geleceğim.',
    yanitlar: 'Teşekkür ederiz Zeynep Hanım, sizi tekrar görmekten mutluluk duyarız! 🙏',
    onaylı: true,
    olusturmaT: '2026-03-10T14:15:00.000Z',
    esnafId: 0,
  },
  {
    id: -3,
    musteriAd: 'Mehmet Arslan',
    puan: 5,
    yorum: 'Randevu alma süreci çok kolay, zamanında hizmet aldım. Fiyat/performans açısından da çok iyi.',
    yanitlar: null,
    onaylı: true,
    olusturmaT: '2026-03-05T09:00:00.000Z',
    esnafId: 0,
  },
]

function basTurlari(ad: string) {
  const parcalar = ad.trim().split(' ')
  return ((parcalar[0]?.[0] ?? '') + (parcalar[1]?.[0] ?? '')).toUpperCase() || '?'
}

function YorumKarti({ yorum, demo }: { yorum: typeof DEMO_YORUMLAR[0] | Yorum; demo?: boolean }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20) + 2)

  function handleLike() {
    if (liked) {
      setLiked(false)
      setLikeCount((c) => c - 1)
    } else {
      setLiked(true)
      setLikeCount((c) => c + 1)
    }
  }

  const tarih = new Date(yorum.olusturmaT)
  const tarihStr = tarih.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 17,
        boxShadow: '0px 47px 47px rgba(0,0,0,0.04), 0px 12px 26px rgba(0,0,0,0.06), 0px 0px 0px rgba(0,0,0,0.04)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        opacity: demo ? 0.85 : 1,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 16, padding: '20px 20px 16px' }}>
        {/* Like */}
        <div
          style={{
            width: 44,
            height: 'fit-content',
            display: 'grid',
            background: '#f8f8f8',
            borderRadius: 8,
          }}
        >
          <button
            onClick={handleLike}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              transition: 'background 0.15s',
            }}
            title="Beğen"
          >
            <svg
              fill={liked ? '#f5356e' : 'none'}
              viewBox="0 0 24 24"
              height={16}
              width={16}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill={liked ? '#f5356e' : 'none'}
                strokeLinecap="round"
                strokeWidth={2}
                stroke={liked ? '#f5356e' : '#707277'}
                d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
              />
            </svg>
          </button>
          <hr style={{ width: '80%', height: 1, background: '#dfe1e6', margin: '0 auto', border: 0 }} />
          <span
            style={{
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: liked ? '#f5356e' : '#707277',
            }}
          >
            {likeCount}
          </span>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 10, alignItems: 'center' }}>
            {/* Avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {basTurlari(yorum.musteriAd)}
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#0fc45a',
                  border: '2px solid white',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                }}
              />
            </div>

            {/* Name & date */}
            <div>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#47484b', display: 'block' }}>
                {yorum.musteriAd}
              </span>
              <p style={{ fontWeight: 500, fontSize: 11, color: '#acaeb4', margin: 0 }}>{tarihStr}</p>
            </div>

            {/* Stars */}
            <YildizPuan puan={yorum.puan} boyut="sm" />
          </div>

          {yorum.yorum && (
            <p style={{ fontSize: 13, lineHeight: 1.65, fontWeight: 500, color: '#5f6064', margin: 0 }}>
              {yorum.yorum}
            </p>
          )}

          {yorum.yanitlar && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--color-bg-muted)',
                borderLeft: '3px solid var(--color-primary)',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                İşletme Yanıtı
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>{yorum.yanitlar}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function YorumListesi({ yorumlar }: YorumListesiProps) {
  const gosterilecek = yorumlar.length > 0 ? yorumlar : DEMO_YORUMLAR
  const demoMu = yorumlar.length === 0

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {gosterilecek.map((yorum) => (
          <YorumKarti key={yorum.id} yorum={yorum} demo={demoMu} />
        ))}
      </div>
      {demoMu && (
        <p
          style={{
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginTop: 12,
            fontStyle: 'italic',
          }}
        >
          * Bu yorumlar örnek amaçlıdır. İlk gerçek yorumu siz yapın!
        </p>
      )}
    </div>
  )
}
