import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function HesapBilgileriSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    select: {
      ad: true,
      soyad: true,
      email: true,
      olusturmaT: true,
      plan: true,
      esnaf: { select: { isletmeAdi: true, sehir: true, slug: true } },
    },
  })

  if (!kullanici) redirect('/isletme/giris')

  const planEtiket: Record<string, string> = {
    UCRETSIZ: 'Ücretsiz',
    STARTER: 'Starter',
    PRO: 'Pro',
  }

  const uyelikTarihi = new Date(kullanici.olusturmaT).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">Hesap Bilgileri</h1>
        <p className="text-slate-500 text-sm mt-0.5">Kişisel bilgilerinizi görüntüleyin</p>
      </div>

      {/* Profil Kartı */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
            {(kullanici.ad?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg text-slate-800">
              {[kullanici.ad, kullanici.soyad].filter(Boolean).join(' ') || 'İsimsiz Kullanıcı'}
            </p>
            <p className="text-sm text-slate-500">{kullanici.email}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {planEtiket[kullanici.plan] ?? kullanici.plan} Plan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Ad', deger: kullanici.ad || '—' },
            { label: 'Soyad', deger: kullanici.soyad || '—' },
            { label: 'E-posta Adresi', deger: kullanici.email },
            { label: 'Üyelik Tarihi', deger: uyelikTarihi },
            { label: 'İşletme Adı', deger: kullanici.esnaf?.isletmeAdi || '—' },
            { label: 'Şehir', deger: kullanici.esnaf?.sehir || '—' },
          ].map(({ label, deger }) => (
            <div key={label} className="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-medium text-slate-800">{deger}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
        <div className="text-2xl">ℹ️</div>
        <div>
          <p className="text-sm font-semibold text-amber-800 mb-1">Bilgilerinizi Güncellemek İster misiniz?</p>
          <p className="text-xs text-amber-700">
            Ad, soyad veya e-posta bilgilerinizi değiştirmek için lütfen destek ekibimizle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  )
}
