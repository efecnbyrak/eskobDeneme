import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'

const PLANLAR = [
  {
    id: 'UCRETSIZ',
    ad: 'Ücretsiz',
    fiyat: '₺0',
    periyot: '/ay',
    renk: 'slate',
    ozellikler: [
      '3 hizmet ekleyebilirsiniz',
      'Temel vitrin sayfası',
      'Randevu sistemi',
      'Yorum yönetimi',
    ],
    eksik: ['WhatsApp butonu', 'Öncelikli listeleme', 'Analitik rapor'],
  },
  {
    id: 'STARTER',
    ad: 'Starter',
    fiyat: '₺99',
    periyot: '/ay',
    renk: 'indigo',
    ozellikler: [
      '10 hizmet ekleyebilirsiniz',
      'WhatsApp butonu',
      'Randevu sistemi',
      'Yorum yönetimi',
      'Kampanya oluşturma',
    ],
    eksik: ['Öncelikli listeleme', 'Gelişmiş analitik', 'API erişimi'],
    populer: false,
  },
  {
    id: 'PRO',
    ad: 'Pro',
    fiyat: '₺249',
    periyot: '/ay',
    renk: 'violet',
    ozellikler: [
      'Sınırsız hizmet',
      'WhatsApp butonu',
      'Öncelikli listeleme',
      'Gelişmiş analitik rapor',
      'Kampanya sistemi',
      'API erişimi',
      'Öncelikli destek',
    ],
    eksik: [],
    populer: true,
  },
]

export default async function PlanSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    select: { plan: true, planBitisTarihi: true },
  })

  const mevcutPlan = kullanici?.plan ?? 'UCRETSIZ'
  const planRenk: Record<string, 'default' | 'info' | 'success'> = { UCRETSIZ: 'default', STARTER: 'info', PRO: 'success' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Plan & Abonelik</h1>
          <p className="text-slate-500 text-sm mt-0.5">Mevcut planınız ve yükseltme seçenekleri</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Mevcut plan:</span>
          <Badge variant={planRenk[mevcutPlan]}>{mevcutPlan}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PLANLAR.map((plan) => {
          const aktif = mevcutPlan === plan.id
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                aktif ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-200 hover:border-slate-300'
              } ${plan.populer ? 'ring-2 ring-violet-200' : ''}`}
            >
              {plan.populer && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">Önerilen</span>
                </div>
              )}
              {aktif && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Mevcut Plan</span>
                </div>
              )}
              <div className="mb-4">
                <p className="font-bold text-lg text-slate-800 font-display">{plan.ad}</p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-bold text-slate-800">{plan.fiyat}</span>
                  <span className="text-slate-400 text-sm pb-1">{plan.periyot}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.ozellikler.map((o) => (
                  <li key={o} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 font-bold">✓</span>
                    {o}
                  </li>
                ))}
                {plan.eksik.map((e) => (
                  <li key={e} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="font-bold">✗</span>
                    {e}
                  </li>
                ))}
              </ul>

              {aktif ? (
                <div className="w-full h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500">
                  Mevcut Plan
                </div>
              ) : (
                <button
                  disabled
                  className="w-full h-10 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Yakında Aktif →
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Ödeme Bilgileri Placeholder */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">
            💳
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Ödeme Bilgileri</h2>
            <p className="text-sm text-slate-500">Kredi kartı veya havale ile ödeme</p>
          </div>
          <span className="ml-auto text-xs font-semibold text-white bg-amber-500 px-2.5 py-1 rounded-full">
            Yakında
          </span>
        </div>

        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center space-y-3">
          <div className="flex justify-center gap-3 mb-4 opacity-50">
            {/* Kart simgeleri */}
            <div className="w-12 h-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
            <div className="w-12 h-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">MC</div>
            <div className="w-12 h-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">TR</div>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            Güvenli ödeme sistemi entegrasyonu hazırlanıyor
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Iyzico altyapısı ile 256-bit SSL şifreli, PCI-DSS uyumlu ödeme sistemi çok yakında aktif olacak.
          </p>
          <div className="pt-2">
            <a
              href="mailto:efecanbayrak3557@gmail.com?subject=Plan%20Yükseltme%20Talebi"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Plan Yükseltme Talebi Gönder
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
