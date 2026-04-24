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
  const [celebrate, setCelebrate] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const router = useRouter()

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!authenticated) {
      router.push('/musteri/giris')
      return
    }

    setYukleniyor(true)
    try {
      if (favori) {
        await fetch(`/api/user/favori?esnafId=${esnafId}`, { method: 'DELETE' })
        setFavori(false)
        setCelebrate(false)
      } else {
        await fetch('/api/user/favori', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ esnafId: Number(esnafId) }),
        })
        setFavori(true)
        setCelebrate(true)
        setTimeout(() => setCelebrate(false), 700)
      }
    } catch {
      // sessizce hata
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <>
      <style>{`
        .fv-wrap {
          --red: rgb(255, 50, 50);
          position: relative;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: none;
          transition: transform 0.2s;
        }
        .fv-wrap:hover { transform: scale(1.1); }
        .fv-wrap:active { transform: scale(0.92); }
        .fv-outline, .fv-filled {
          fill: var(--red);
          position: absolute;
          width: 20px;
          height: 20px;
          transition: all 0.2s;
        }
        .fv-filled {
          display: none;
        }
        .fv-wrap.aktif .fv-outline { display: none; }
        .fv-wrap.aktif .fv-filled {
          display: block;
          animation: fv-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .fv-celebrate {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          pointer-events: none;
          opacity: 0;
        }
        .fv-celebrate.show {
          animation: fv-celebrate 0.6s ease-out forwards;
        }
        .fv-poly { stroke: var(--red); fill: var(--red); }
        @keyframes fv-pop {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes fv-celebrate {
          0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 1; }
          70%  { opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
        }
      `}</style>
      <div
        className={`fv-wrap${favori ? ' aktif' : ''}`}
        onClick={toggle}
        role="button"
        title={favori ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
        style={{ opacity: yukleniyor ? 0.6 : 1 }}
      >
        <svg className="fv-outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
        </svg>
        <svg className="fv-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className={`fv-celebrate${celebrate ? ' show' : ''}`} viewBox="0 0 100 100">
          <polygon className="fv-poly" points="10,10 20,20" strokeWidth="3" />
          <polygon className="fv-poly" points="10,50 20,50" strokeWidth="3" />
          <polygon className="fv-poly" points="20,80 30,70" strokeWidth="3" />
          <polygon className="fv-poly" points="90,10 80,20" strokeWidth="3" />
          <polygon className="fv-poly" points="90,50 80,50" strokeWidth="3" />
          <polygon className="fv-poly" points="80,80 70,70" strokeWidth="3" />
        </svg>
      </div>
    </>
  )
}
