'use client'

import { useState } from 'react'
import Link from 'next/link'

interface OnizlemeClientProps {
  vitrinUrl: string
  slug: string
}

type Mod = 'masaustu' | 'tablet' | 'telefon'

const MODLAR: { id: Mod; label: string; genislik: number | null; yukseklik: number | null; ikon: string; aciklama: string }[] = [
  { id: 'masaustu', label: 'Bilgisayar', genislik: null, yukseklik: null, ikon: '🖥️', aciklama: 'Tam ekran' },
  { id: 'tablet', label: 'Tablet', genislik: 768, yukseklik: 1024, ikon: '📋', aciklama: '768 × 1024' },
  { id: 'telefon', label: 'Telefon', genislik: 390, yukseklik: 844, ikon: '📱', aciklama: '390 × 844' },
]

export function OnizlemeClient({ vitrinUrl, slug }: OnizlemeClientProps) {
  const [mod, setMod] = useState<Mod>('masaustu')

  const aktifMod = MODLAR.find((m) => m.id === mod)!

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Ön İzleme</h1>
          <p className="text-slate-500 text-sm mt-0.5">Vitrinizin müşterilere nasıl göründüğünü inceleyin</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={vitrinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Yeni Sekmede Aç
          </a>
          <Link
            href="/isletme/ayarlar/vitrin"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Vitrinini Düzenle
          </Link>
        </div>
      </div>

      {/* Cihaz Seçici */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 w-fit">
        {MODLAR.map((m) => (
          <button
            key={m.id}
            onClick={() => setMod(m.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mod === m.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-base">{m.ikon}</span>
            <span>{m.label} Görünümü</span>
            {m.aciklama !== 'Tam ekran' && (
              <span className={`text-xs ${mod === m.id ? 'text-indigo-200' : 'text-slate-400'}`}>{m.aciklama}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bilgi Banner */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <svg className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Bu önizleme müşterilerinizin vitrinizi nasıl gördüğünü yansıtır. Değişiklikler kayıt sonrası otomatik güncellenir.
      </div>

      {/* İzleme Alanı */}
      <div className="bg-slate-100 rounded-2xl p-6 flex items-center justify-center min-h-[600px]">
        {mod === 'masaustu' ? (
          /* Masaüstü — tam genişlik */
          <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white" style={{ height: 640 }}>
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="bg-white rounded px-3 py-1 text-xs text-slate-400 font-mono truncate">{vitrinUrl}</div>
              </div>
            </div>
            <iframe
              src={vitrinUrl}
              className="w-full"
              style={{ height: 'calc(640px - 44px)', border: 'none' }}
              title={`Vitrin Önizleme — ${slug}`}
            />
          </div>
        ) : mod === 'tablet' ? (
          /* Tablet */
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-white"
            style={{ width: aktifMod.genislik!, height: aktifMod.yukseklik!, maxWidth: '100%' }}
          >
            <iframe
              src={vitrinUrl}
              className="w-full h-full"
              style={{ border: 'none' }}
              title={`Tablet Önizleme — ${slug}`}
            />
          </div>
        ) : (
          /* Telefon — notch ile */
          <div
            className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-slate-800 bg-white"
            style={{ width: aktifMod.genislik!, height: aktifMod.yukseklik!, maxWidth: '100%' }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-800 rounded-b-2xl z-10" />
            <iframe
              src={vitrinUrl}
              className="w-full h-full"
              style={{ border: 'none' }}
              title={`Telefon Önizleme — ${slug}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
