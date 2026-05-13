import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatFiyat } from '@/lib/utils'

export default async function KampanyalarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          hizmetler: {
            where: { aktif: true },
            orderBy: { sira: 'asc' },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const hizmetler = kullanici.esnaf.hizmetler
  const now = new Date()
  const aktifKampanyalar = hizmetler.filter(
    (h) => h.indirimYuzde && h.indirimYuzde > 0 && (!h.indirimBitis || h.indirimBitis >= now)
  )
  const pasifKampanyalar = hizmetler.filter(
    (h) => h.indirimYuzde && h.indirimYuzde > 0 && h.indirimBitis && h.indirimBitis < now
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Kampanyalar</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {aktifKampanyalar.length} aktif kampanya
          </p>
        </div>
        <Link
          href="/isletme/hizmetler"
          className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          + Hizmet Üzerinden Kampanya
        </Link>
      </div>

      {/* Bilgi Kutusu */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-indigo-800 mb-1">Kampanya Nasıl Çalışır?</p>
            <p className="text-sm text-indigo-700">
              Hizmetlerinize indirim yüzdesi, başlangıç ve bitiş tarihi atayarak kampanya oluşturabilirsiniz.
              Aktif kampanyalar müşteri vitrininde öne çıkar ve anasayfadaki Kampanyalar bölümünde görünür.
            </p>
            <Link href="/isletme/hizmetler" className="text-sm font-semibold text-indigo-600 hover:underline mt-1 inline-block">
              Hizmetlere git →
            </Link>
          </div>
        </div>
      </div>

      {/* Aktif Kampanyalar */}
      <div>
        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Aktif Kampanyalar</h2>
        {aktifKampanyalar.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 text-center py-12">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="font-semibold text-slate-600 mb-1">Aktif kampanya yok</p>
            <p className="text-slate-400 text-sm mb-4">Hizmetlerinize indirim ekleyerek kampanya oluşturun.</p>
            <Link
              href="/isletme/hizmetler"
              className="inline-flex items-center gap-2 h-9 px-5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Hizmetlere Git
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {aktifKampanyalar.map((h) => {
              const indirimliF = Number(h.fiyat) * (1 - (h.indirimYuzde! / 100))
              const kalanGun = h.indirimBitis
                ? Math.max(0, Math.ceil((h.indirimBitis.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                : null

              return (
                <div key={h.id} className="bg-white rounded-xl border border-emerald-200 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    🏷️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{h.ad}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-slate-400 line-through">{formatFiyat(Number(h.fiyat))}</span>
                      <span className="text-sm font-bold text-emerald-600">{formatFiyat(indirimliF)}</span>
                      <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                        %{h.indirimYuzde} indirim
                      </span>
                    </div>
                    {kalanGun !== null && (
                      <p className="text-xs text-slate-400 mt-1">
                        {kalanGun === 0 ? 'Bugün bitiyor' : `${kalanGun} gün kaldı`}
                      </p>
                    )}
                    {kalanGun === null && (
                      <p className="text-xs text-emerald-600 mt-1 font-medium">Süresiz kampanya</p>
                    )}
                  </div>
                  <Link
                    href="/isletme/hizmetler"
                    className="shrink-0 text-sm text-indigo-600 font-semibold hover:underline"
                  >
                    Düzenle
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sona Eren Kampanyalar */}
      {pasifKampanyalar.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Sona Eren Kampanyalar</h2>
          <div className="space-y-3">
            {pasifKampanyalar.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 opacity-60">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  ⏰
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-600">{h.ad}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    %{h.indirimYuzde} indirim • {h.indirimBitis?.toLocaleDateString('tr-TR')} tarihinde sona erdi
                  </p>
                </div>
                <Link href="/isletme/hizmetler" className="shrink-0 text-sm text-indigo-600 font-semibold hover:underline">
                  Yenile
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
