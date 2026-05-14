'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  esnaf: {
    id: number
    isletmeAdi: string
    bekleyenIsletmeAdi: string | null
    slug: string
    sehir: string
    ilce: string
    aktif: boolean
    onayli: boolean
    kategori: { ad: string; ikon: string }
    sahip: { email: string; ad: string; soyad: string }
  }
}

export function EsnafSatir({ esnaf }: Props) {
  const router = useRouter()
  const [aktif, setAktif] = useState(esnaf.aktif)
  const [onayli, setOnayli] = useState(esnaf.onayli)
  const [bekleyenAd, setBekleyenAd] = useState(esnaf.bekleyenIsletmeAdi)
  const [yukleniyor, setYukleniyor] = useState(false)

  async function degistir(alan: 'aktif' | 'onayli', deger: boolean) {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/admin/esnaflar/${esnaf.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [alan]: deger }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.error ?? 'Güncellenemedi.')
        return
      }
      if (alan === 'aktif') setAktif(deger)
      else setOnayli(deger)
      router.refresh()
    } finally {
      setYukleniyor(false)
    }
  }

  async function isletmeAdiKarar(onayla: boolean) {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/admin/esnaflar/${esnaf.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isletmeAdiOnayla: onayla }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.error ?? 'İşlem başarısız.')
        return
      }
      setBekleyenAd(null)
      router.refresh()
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      <td style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{esnaf.kategori.ikon}</span>
          <div>
            <div style={{ fontWeight: 600 }}>{esnaf.isletmeAdi}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              /{esnaf.slug}
            </div>
            {bekleyenAd && (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600 }}>
                  📝 İsim değişikliği: <span style={{ fontStyle: 'italic' }}>{bekleyenAd}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <button
                    onClick={() => isletmeAdiKarar(true)}
                    disabled={yukleniyor}
                    style={{
                      padding: '3px 8px', fontSize: 10, fontWeight: 700, borderRadius: 6,
                      border: '1px solid #86EFAC', color: '#166534', background: '#DCFCE7',
                      cursor: yukleniyor ? 'wait' : 'pointer',
                    }}
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => isletmeAdiKarar(false)}
                    disabled={yukleniyor}
                    style={{
                      padding: '3px 8px', fontSize: 10, fontWeight: 700, borderRadius: 6,
                      border: '1px solid #FCA5A5', color: '#991B1B', background: '#FEE2E2',
                      cursor: yukleniyor ? 'wait' : 'pointer',
                    }}
                  >
                    Reddet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 20px' }}>
        <div style={{ fontSize: 13 }}>
          {esnaf.sahip.ad} {esnaf.sahip.soyad}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {esnaf.sahip.email}
        </div>
      </td>
      <td style={{ padding: '14px 20px', fontSize: 13 }}>{esnaf.kategori.ad}</td>
      <td style={{ padding: '14px 20px', fontSize: 13 }}>
        {esnaf.sehir}, {esnaf.ilce}
      </td>
      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => degistir('onayli', !onayli)}
            disabled={yukleniyor}
            style={{
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 8,
              border: '1px solid',
              borderColor: onayli ? '#86EFAC' : '#FCA5A5',
              color: onayli ? '#166534' : '#991B1B',
              background: onayli ? '#DCFCE7' : '#FEE2E2',
              cursor: yukleniyor ? 'wait' : 'pointer',
            }}
          >
            {onayli ? 'ONAYLI' : 'ONAYSIZ'}
          </button>
          <button
            onClick={() => degistir('aktif', !aktif)}
            disabled={yukleniyor}
            style={{
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 8,
              border: '1px solid',
              borderColor: aktif ? '#86EFAC' : '#FCA5A5',
              color: aktif ? '#166534' : '#991B1B',
              background: aktif ? '#DCFCE7' : '#FEE2E2',
              cursor: yukleniyor ? 'wait' : 'pointer',
            }}
          >
            {aktif ? 'AKTİF' : 'PASİF'}
          </button>
        </div>
      </td>
    </tr>
  )
}
