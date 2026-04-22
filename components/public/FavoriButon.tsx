'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FavoriButonProps {
  esnafId: number | string
  baslangicFavori?: boolean
  authenticated?: boolean
}

export function FavoriButon({ esnafId, baslangicFavori = false, authenticated = false }: FavoriButonProps) {
  const [favori, setFavori] = useState(baslangicFavori)
  const [yukleniyor, setYukleniyor] = useState(false)
  const router = useRouter()

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!authenticated) {
      router.push('/giris')
      return
    }

    setYukleniyor(true)
    try {
      if (favori) {
        await fetch(`/api/user/favori?esnafId=${esnafId}`, { method: 'DELETE' })
        setFavori(false)
      } else {
        await fetch('/api/user/favori', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ esnafId: Number(esnafId) }),
        })
        setFavori(true)
      }
    } catch {
      // sessizce hata
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={yukleniyor}
      title={favori ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        border: 'none', cursor: yukleniyor ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.2s',
        transform: yukleniyor ? 'scale(0.9)' : 'scale(1)',
      }}
    >
      <svg
        style={{ width: 18, height: 18, transition: 'all 0.2s' }}
        fill={favori ? '#EF4444' : 'none'}
        stroke={favori ? '#EF4444' : 'rgba(0,0,0,0.5)'}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
