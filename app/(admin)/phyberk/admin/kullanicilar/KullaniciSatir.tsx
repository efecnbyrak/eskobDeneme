'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

type Props = {
  kullanici: {
    id: number
    ad: string
    soyad: string
    email: string
    telefon: string | null
    rol: Rol
    olusturmaT: string
  }
  superMi: boolean
  kendiMi: boolean
}

export function KullaniciSatir({ kullanici, superMi, kendiMi }: Props) {
  const router = useRouter()
  const [rol, setRol] = useState<Rol>(kullanici.rol)
  const [yukleniyor, setYukleniyor] = useState(false)

  async function rolDegistir(yeniRol: Rol) {
    if (yeniRol === rol) return
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/admin/kullanicilar/${kullanici.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: yeniRol }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.error ?? 'Rol değiştirilemedi.')
        return
      }
      setRol(yeniRol)
      router.refresh()
    } finally {
      setYukleniyor(false)
    }
  }

  async function sil() {
    if (!confirm(`${kullanici.email} silinsin mi? Bu işlem geri alınamaz.`)) return
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/admin/kullanicilar/${kullanici.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.error ?? 'Silinemedi.')
        return
      }
      router.refresh()
    } finally {
      setYukleniyor(false)
    }
  }

  const renk =
    rol === 'SUPER_ADMIN'
      ? '#F59E0B'
      : rol === 'ADMIN'
        ? '#6366F1'
        : rol === 'BUSINESS'
          ? '#0BC15C'
          : '#64748B'

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      <td style={{ padding: '14px 20px' }}>
        <div style={{ fontWeight: 600 }}>
          {kullanici.ad} {kullanici.soyad}
        </div>
        {kullanici.telefon && (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {kullanici.telefon}
          </div>
        )}
      </td>
      <td style={{ padding: '14px 20px', color: 'var(--color-text-secondary)' }}>
        {kullanici.email}
      </td>
      <td style={{ padding: '14px 20px' }}>
        {superMi && !kendiMi ? (
          <select
            value={rol}
            onChange={(e) => rolDegistir(e.target.value as Rol)}
            disabled={yukleniyor}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: `1px solid ${renk}`,
              color: renk,
              fontWeight: 700,
              fontSize: 12,
              background: 'white',
            }}
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="BUSINESS">BUSINESS</option>
            <option value="USER">USER</option>
          </select>
        ) : (
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 9999,
              background: `${renk}20`,
              color: renk,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {rol}
          </span>
        )}
      </td>
      <td style={{ padding: '14px 20px', color: 'var(--color-text-secondary)', fontSize: 13 }}>
        {new Date(kullanici.olusturmaT).toLocaleDateString('tr-TR')}
      </td>
      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
        {superMi && !kendiMi ? (
          <button
            onClick={sil}
            disabled={yukleniyor}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              color: '#DC2626',
              background: 'white',
              border: '1px solid #FCA5A5',
              borderRadius: 8,
              cursor: yukleniyor ? 'wait' : 'pointer',
            }}
          >
            Sil
          </button>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>—</span>
        )}
      </td>
    </tr>
  )
}
