'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'

const PLAN_BILGI: Record<string, { ad: string; fiyat: string; renk: string }> = {
  STARTER: { ad: 'Gold Plan', fiyat: '₺200/ay', renk: '#f59e0b' },
  PRO: { ad: 'Premium Plan', fiyat: '₺500/ay', renk: '#7c3aed' },
}

function OdemeSayfasiIcerik() {
  const params = useSearchParams()
  const router = useRouter()
  const plan = params.get('plan') ?? 'PRO'
  const planBilgi = PLAN_BILGI[plan] ?? PLAN_BILGI['PRO']

  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function odemeyiBaslat() {
      try {
        const res = await fetch('/api/odeme/baslat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
        const data = await res.json()
        if (!res.ok || !data.checkoutFormContent) {
          setHata(data.error ?? 'Ödeme formu yüklenemedi.')
          return
        }
        if (formRef.current) {
          formRef.current.innerHTML = data.checkoutFormContent
          // İyzico script'lerini çalıştır
          formRef.current.querySelectorAll('script').forEach((eski) => {
            const yeni = document.createElement('script')
            yeni.text = eski.text
            if (eski.src) yeni.src = eski.src
            eski.parentNode?.replaceChild(yeni, eski)
          })
        }
      } catch {
        setHata('Sunucu hatası. Lütfen tekrar deneyin.')
      } finally {
        setYukleniyor(false)
      }
    }
    odemeyiBaslat()
  }, [plan])

  return (
    <div className="space-y-6 max-w-2xl">
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
        style={{ borderColor: planBilgi.renk, background: `${planBilgi.renk}10` }}
      >
        <div>
          <p className="font-bold text-lg" style={{ color: planBilgi.renk }}>{planBilgi.ad}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Aylık abonelik — istediğiniz zaman iptal</p>
        </div>
        <p className="text-2xl font-black" style={{ color: planBilgi.renk }}>{planBilgi.fiyat}</p>
      </div>

      {/* İyzico Ödeme Formu */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 min-h-[400px] flex items-center justify-center">
        {yukleniyor && (
          <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
            <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm">Ödeme formu yükleniyor...</p>
          </div>
        )}
        {hata && (
          <div className="text-center space-y-3">
            <p className="text-red-500 font-medium">{hata}</p>
            <button
              onClick={() => { setHata(null); setYukleniyor(true) }}
              className="text-sm text-[var(--color-primary)] underline"
            >
              Tekrar dene
            </button>
          </div>
        )}
        <div ref={formRef} className={yukleniyor || hata ? 'hidden' : 'w-full'} />
      </div>

      <p className="text-xs text-center text-[var(--color-text-secondary)]">
        Ödemeniz İyzico güvencesiyle işlenir. Kart bilgileriniz sistemimizde saklanmaz.
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
