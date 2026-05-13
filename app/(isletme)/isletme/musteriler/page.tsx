import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatTarih } from '@/lib/utils'

export default async function MusterilerSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { include: { randevular: { orderBy: { olusturmaT: 'desc' } } } } },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')
  const esnaf = kullanici.esnaf

  type Musteri = { ad: string; tel: string; son: string; sayi: number }
  const benzersizMusteriler: Musteri[] = Object.values(
    esnaf.randevular.reduce<Record<string, Musteri>>((acc, r) => {
      const key = r.musteriTelefon
      if (!acc[key]) {
        acc[key] = { ad: r.musteriAd, tel: r.musteriTelefon, son: r.tarih.toISOString(), sayi: 0 }
      }
      acc[key].sayi++
      return acc
    }, {})
  ).sort((a, b) => b.sayi - a.sayi)

  const tekrarGelen = benzersizMusteriler.filter((m) => m.sayi > 1).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800">Müşteriler</h1>
          <p className="text-slate-500 text-sm mt-0.5">{benzersizMusteriler.length} benzersiz müşteri</p>
        </div>
        {tekrarGelen > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 text-sm text-indigo-700 font-medium">
            🔄 {tekrarGelen} tekrar gelen müşteri
          </div>
        )}
      </div>

      {benzersizMusteriler.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <p className="text-5xl mb-4">👥</p>
          <p className="font-semibold text-slate-700">Henüz müşteri yok</p>
          <p className="text-slate-400 text-sm mt-1">Randevu alındıkça müşterileriniz burada görünecek.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Müşteri</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefon</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Randevu</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Son Randevu</th>
              </tr>
            </thead>
            <tbody>
              {benzersizMusteriler.map((m) => (
                <tr key={m.tel} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-800">
                    {m.ad}
                    {m.sayi > 1 && (
                      <span className="ml-2 text-xs text-indigo-600 font-normal">tekrar gelen</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-500">{m.tel}</td>
                  <td className="px-6 py-3">
                    <span className="font-semibold text-slate-700">{m.sayi}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{formatTarih(m.son)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
