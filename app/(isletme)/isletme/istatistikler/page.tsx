import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function IstatistiklerSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          istatistikler: { orderBy: { tarih: 'desc' }, take: 30 },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const istatistikler = kullanici.esnaf.istatistikler
  const toplamGoruntulenme = istatistikler.reduce((s, i) => s + i.goruntulenme, 0)
  const toplamTiklanma = istatistikler.reduce((s, i) => s + i.tiklanma, 0)
  const toplamRandevu = istatistikler.reduce((s, i) => s + i.randevuSay, 0)
  const toplamWhatsapp = istatistikler.reduce((s, i) => s + i.whatsappT, 0)

  const maxGoruntulenme = Math.max(...istatistikler.map((i) => i.goruntulenme), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-800">İstatistikler</h1>
        <p className="text-slate-500 text-sm mt-0.5">Son 30 günlük performans verileriniz</p>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Görüntülenme', deger: toplamGoruntulenme, ikon: '👁', renk: '#4f46e5' },
          { label: 'Toplam Tıklanma', deger: toplamTiklanma, ikon: '🖱️', renk: '#0891b2' },
          { label: 'Randevu (İstatistik)', deger: toplamRandevu, ikon: '📅', renk: '#059669' },
          { label: 'WhatsApp Tıklaması', deger: toplamWhatsapp, ikon: '💬', renk: '#d97706' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium leading-tight">{k.label}</p>
                <p className="text-2xl font-bold mt-1 font-display" style={{ color: k.renk }}>{k.deger}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${k.renk}18` }}>
                {k.ikon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Günlük Görüntülenme Grafiği */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-6 font-display">Günlük Görüntülenme (Son 30 Gün)</h2>
        {istatistikler.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-slate-500 text-sm">Henüz yeterli veri yok. Vitrin ziyaretçi aldıkça burada görünecek.</p>
          </div>
        ) : (
          <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
            {[...istatistikler].reverse().map((ist, i) => {
              const yukseklik = Math.round((ist.goruntulenme / maxGoruntulenme) * 100)
              return (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[20px] flex-1">
                  <div
                    className="w-full rounded-t-sm bg-indigo-400 hover:bg-indigo-500 transition-colors"
                    style={{ height: `${Math.max(yukseklik, 2)}%` }}
                    title={`${ist.tarih.toLocaleDateString('tr-TR')}: ${ist.goruntulenme} görüntülenme`}
                  />
                  {i % 7 === 0 && (
                    <span className="text-[9px] text-slate-400 rotate-45 origin-left whitespace-nowrap">
                      {ist.tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detay Tablosu */}
      {istatistikler.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 font-display">Günlük Detay</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tarih</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Görüntülenme</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tıklanma</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Randevu</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {istatistikler.map((ist) => (
                <tr key={ist.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-700">
                    {ist.tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-indigo-600">{ist.goruntulenme}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ist.tiklanma}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ist.randevuSay}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ist.whatsappT}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
