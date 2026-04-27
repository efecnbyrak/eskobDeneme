'use client'

import { useState } from 'react'

interface YorumSatirProps {
  yorum: {
    id: number
    musteriAd: string
    kullanici: { ad: string; soyad: string; email: string } | null
    esnaf: { isletmeAdi: string; slug: string; sehir: string }
    puan: number
    yorum: string | null
    onaylı: boolean
    olusturmaT: Date
  }
}

export function YorumSatir({ yorum: baslangic }: YorumSatirProps) {
  const [onaylı, setOnaylı] = useState(baslangic.onaylı)
  const [yukleniyor, setYukleniyor] = useState(false)

  async function onayla() {
    setYukleniyor(true)
    try {
      await fetch(`/api/admin/yorumlar/${baslangic.id}/onayla`, { method: 'POST' })
      setOnaylı(true)
    } finally {
      setYukleniyor(false)
    }
  }

  async function sil() {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return
    setYukleniyor(true)
    try {
      await fetch(`/api/admin/yorumlar/${baslangic.id}`, { method: 'DELETE' })
      window.location.reload()
    } finally {
      setYukleniyor(false)
    }
  }

  const tarih = new Date(baslangic.olusturmaT).toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  const yildizlar = '★'.repeat(baslangic.puan) + '☆'.repeat(5 - baslangic.puan)

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)', background: onaylı ? 'transparent' : '#FFFBEB' }}>
      <td style={{ padding: '14px 20px' }}>
        <p style={{ fontWeight: 600 }}>{baslangic.musteriAd}</p>
        {baslangic.kullanici && (
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{baslangic.kullanici.email}</p>
        )}
      </td>
      <td style={{ padding: '14px 20px' }}>
        <p style={{ fontWeight: 500 }}>{baslangic.esnaf.isletmeAdi}</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{baslangic.esnaf.sehir}</p>
      </td>
      <td style={{ padding: '14px 20px' }}>
        <span style={{ color: '#F59E0B', fontSize: 15, letterSpacing: 1 }}>{yildizlar}</span>
      </td>
      <td style={{ padding: '14px 20px', maxWidth: 240 }}>
        {baslangic.yorum ? (
          <p style={{ fontSize: 13, color: 'var(--color-text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {baslangic.yorum}
          </p>
        ) : (
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>—</span>
        )}
      </td>
      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', fontSize: 13 }}>
        {tarih}
      </td>
      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
          {onaylı ? (
            <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', padding: '4px 10px', background: '#D1FAE5', borderRadius: 9999 }}>
              Onaylı
            </span>
          ) : (
            <button
              onClick={onayla}
              disabled={yukleniyor}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: yukleniyor ? 0.6 : 1 }}
            >
              Onayla
            </button>
          )}
          <button
            onClick={sil}
            disabled={yukleniyor}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #FCA5A5', background: '#FFF5F5', color: '#DC2626', fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: yukleniyor ? 0.6 : 1 }}
          >
            Sil
          </button>
        </div>
      </td>
    </tr>
  )
}
