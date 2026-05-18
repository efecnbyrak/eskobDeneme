'use client'

import { useState } from 'react'

interface Props {
  yorumId: number
  baslangicBildirildi: boolean
}

export function YorumBildirButon({ yorumId, baslangicBildirildi }: Props) {
  const [bildirildi, setBildirildi] = useState(baslangicBildirildi)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [onayModal, setOnayModal] = useState(false)

  if (bildirildi) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 font-medium">
        ⚑ Bildirildi — İnceleniyor
      </span>
    )
  }

  async function bildir() {
    setYukleniyor(true)
    try {
      const res = await fetch(`/api/yorum/${yorumId}/bildir`, { method: 'POST' })
      if (res.ok) {
        setBildirildi(true)
        setOnayModal(false)
      } else {
        const d = await res.json().catch(() => ({}))
        alert(d.error || 'Bir hata oluştu.')
      }
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOnayModal(true)}
        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        ⚑ Yorum Bildir
      </button>

      {onayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOnayModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                ⚑
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800 text-base">Yorumu Bildirmek İstiyor musunuz?</p>
                <p className="text-sm text-slate-500 mt-1">Bu yorum inceleme için yöneticilere iletilecek. Bu işlem geri alınamaz.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOnayModal(false)}
                disabled={yukleniyor}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={bildir}
                disabled={yukleniyor}
                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {yukleniyor ? 'Bildiriliyor...' : 'Evet, Bildir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
