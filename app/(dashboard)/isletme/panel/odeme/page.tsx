'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'

const PLAN_BILGI: Record<string, { ad: string; fiyat: string; renk: string }> = {
  STARTER: { ad: 'Gold Plan', fiyat: '₺200/ay', renk: '#f59e0b' },
  PRO: { ad: 'Premium Plan', fiyat: '₺500/ay', renk: '#7c3aed' },
}

function kartNumarasiFormat(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function sonKullanmaFormat(val: string) {
  const temiz = val.replace(/\D/g, '').slice(0, 4)
  if (temiz.length >= 3) return temiz.slice(0, 2) + '/' + temiz.slice(2)
  return temiz
}

type Adim = 'form' | 'yukleniyor' | 'basarili'

function OdemeSayfasiIcerik() {
  const params = useSearchParams()
  const router = useRouter()
  const plan = params.get('plan') ?? 'PRO'
  const planBilgi = PLAN_BILGI[plan] ?? PLAN_BILGI['PRO']

  const [adim, setAdim] = useState<Adim>('form')
  const [kart, setKart] = useState({
    numara: '',
    adSoyad: '',
    sonKullanma: '',
    cvv: '',
  })
  const [cvvGoster, setCvvGoster] = useState(false)

  function handleOde(e: React.FormEvent) {
    e.preventDefault()
    setAdim('yukleniyor')
    setTimeout(() => setAdim('basarili'), 1800)
  }

  return (
    <div className="space-y-6 max-w-lg">
      <TopBar
        baslik="Plan Yükselt"
        aciklama={`${planBilgi.ad} — ${planBilgi.fiyat}`}
      />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        ← Geri dön
      </button>

      {/* Plan özet kartı */}
      <div
        className="rounded-[var(--radius-lg)] p-4 border-2 flex items-center justify-between"
        style={{ borderColor: planBilgi.renk, background: `${planBilgi.renk}12` }}
      >
        <div>
          <p className="font-bold text-lg" style={{ color: planBilgi.renk }}>{planBilgi.ad}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Aylık abonelik — istediğiniz zaman iptal</p>
        </div>
        <p className="text-2xl font-black" style={{ color: planBilgi.renk }}>{planBilgi.fiyat}</p>
      </div>

      {/* İçerik alanı */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
        {adim === 'basarili' ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">Ödeme Alındı!</p>
              <p className="text-sm text-slate-500 mt-1">{planBilgi.ad} planına başarıyla geçtiniz.</p>
            </div>
            <button
              onClick={() => router.push('/isletme/panel')}
              className="mt-2 px-6 py-2.5 text-sm font-semibold rounded-xl text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}
            >
              Panele Dön
            </button>
          </div>
        ) : adim === 'yukleniyor' ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <svg className="animate-spin w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm text-slate-500 font-medium">Ödeme işleniyor...</p>
          </div>
        ) : (
          <form onSubmit={handleOde} className="space-y-4">
            <p className="text-sm font-semibold text-slate-700 mb-1">Kart Bilgileri</p>

            {/* Kart numarası */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kart Numarası</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 tracking-widest font-mono transition-all"
                  placeholder="0000 0000 0000 0000"
                  value={kart.numara}
                  maxLength={19}
                  required
                  onChange={(e) => setKart((p) => ({ ...p, numara: kartNumarasiFormat(e.target.value) }))}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-6 h-4 bg-red-500 rounded-sm opacity-80" />
                  <div className="w-6 h-4 bg-yellow-400 rounded-sm opacity-80 -ml-2" />
                </div>
              </div>
            </div>

            {/* Ad Soyad */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kart Üzerindeki Ad</label>
              <input
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 uppercase transition-all"
                placeholder="AD SOYAD"
                value={kart.adSoyad}
                required
                onChange={(e) => setKart((p) => ({ ...p, adSoyad: e.target.value.toUpperCase() }))}
              />
            </div>

            {/* Son Kullanma + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Son Kullanma</label>
                <input
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 font-mono tracking-widest transition-all"
                  placeholder="AA/YY"
                  value={kart.sonKullanma}
                  maxLength={5}
                  required
                  onChange={(e) => setKart((p) => ({ ...p, sonKullanma: sonKullanmaFormat(e.target.value) }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CVV</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 font-mono tracking-widest transition-all"
                    placeholder="•••"
                    type={cvvGoster ? 'text' : 'password'}
                    value={kart.cvv}
                    maxLength={4}
                    required
                    onChange={(e) => setKart((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setCvvGoster((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {cvvGoster ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Güvenlik badge */}
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-emerald-700 font-medium">SSL 256-bit şifreleme — Kart bilgileriniz güvende</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-bold rounded-xl text-white transition-all mt-2"
              style={{ background: `linear-gradient(135deg, ${planBilgi.renk}, ${planBilgi.renk}cc)`, boxShadow: `0 4px 14px ${planBilgi.renk}55` }}
            >
              {planBilgi.fiyat} Öde — {planBilgi.ad}
            </button>
          </form>
        )}
      </div>

      <p className="text-xs text-center text-[var(--color-text-secondary)]">
        Ödemeniz güvence altında işlenir. İstediğiniz zaman iptal edebilirsiniz.
      </p>
    </div>
  )
}

export default function OdemeSayfasi() {
  return (
    <Suspense>
      <OdemeSayfasiIcerik />
    </Suspense>
  )
}
