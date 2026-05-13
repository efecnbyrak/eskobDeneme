import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'

export default async function YorumlarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: { yorumlar: { orderBy: { olusturmaT: 'desc' } } },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const yorumlar = kullanici.esnaf.yorumlar
  const ortalama = yorumlar.length
    ? (yorumlar.reduce((s, y) => s + y.puan, 0) / yorumlar.length).toFixed(1)
    : null
  const onayliSayisi = yorumlar.filter((y) => y.onaylı).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Yorumlar</h1>
          <p className="text-slate-500 text-sm mt-0.5">Toplam {yorumlar.length} yorum — {onayliSayisi} onaylı</p>
        </div>
        {ortalama && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-amber-700 text-lg">{ortalama}</span>
            <span className="text-xs text-amber-600">/ 5</span>
          </div>
        )}
      </div>

      {yorumlar.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <p className="text-5xl mb-4">⭐</p>
          <p className="font-semibold text-slate-700">Henüz yorum yok</p>
          <p className="text-slate-400 text-sm mt-1">Müşterileriniz vitrininizdeki yorum formundan değerlendirme bırakabilir.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {yorumlar.map((y) => (
            <div key={y.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-sm text-slate-800">{y.musteriAd}</p>
                    <Badge variant={y.onaylı ? 'success' : 'warning'}>
                      {y.onaylı ? 'Onaylı' : 'Bekliyor'}
                    </Badge>
                    <span className="text-xs text-slate-400">{formatTarih(y.olusturmaT.toISOString())}</span>
                  </div>
                  {y.yorum && (
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{y.yorum}</p>
                  )}
                  {y.yanitlar && (
                    <div className="mt-3 pl-3 border-l-2 border-indigo-200">
                      <p className="text-xs font-semibold text-indigo-600 mb-0.5">İşletme Yanıtı</p>
                      <p className="text-sm text-slate-600">{y.yanitlar}</p>
                    </div>
                  )}
                </div>
                <YildizPuan puan={y.puan} boyut="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
