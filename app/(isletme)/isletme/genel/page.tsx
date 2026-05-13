import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QRKodWidget } from '@/components/shared/QRKodWidget'
import { formatTarih } from '@/lib/utils'

const HIZLI_EYLEMLER = [
  { href: '/isletme/hizmetler', ikon: '➕', baslik: 'Hizmet Ekle', aciklama: 'Yeni hizmet veya fiyat ekle', renk: '#4f46e5' },
  { href: '/isletme/ayarlar/vitrin', ikon: '🏪', baslik: 'Vitrin Düzenle', aciklama: 'Fotoğraf ve bilgileri güncelle', renk: '#0891b2' },
  { href: '/isletme/kampanyalar', ikon: '🏷️', baslik: 'Kampanya Oluştur', aciklama: 'İndirim ve fırsat tanımla', renk: '#059669' },
  { href: '/isletme/randevular', ikon: '📅', baslik: 'Randevular', aciklama: 'Bekleyen randevuları yönet', renk: '#d97706' },
  { href: '/isletme/musteriler', ikon: '👥', baslik: 'Müşteriler', aciklama: 'Müşteri geçmişini incele', renk: '#7c3aed' },
  { href: '/isletme/yorumlar', ikon: '⭐', baslik: 'Yorumlar', aciklama: 'Yorumlara yanıt ver', renk: '#dc2626' },
]

export default async function GenelSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          istatistikler: { orderBy: { tarih: 'desc' }, take: 30 },
          randevular: { orderBy: { tarih: 'desc' }, take: 5, include: { hizmet: true } },
          yorumlar: { select: { puan: true } },
          _count: { select: { hizmetler: true } },
        },
      },
    },
  })

  if (!kullanici?.esnaf) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-7xl mb-6">🏪</div>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-3">
          İşletme Kaydınızı Tamamlayın
        </h1>
        <p className="text-slate-500 max-w-md leading-relaxed mb-8">
          Henüz bir işletme profiliniz oluşturulmamış. Vitrinizi kurmak ve müşteri kazanmaya başlamak için işletme bilgilerinizi ekleyin.
        </p>
        <Link
          href="/isletme/ayarlar/vitrin"
          className="inline-flex items-center gap-2 h-12 px-8 text-base font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Vitrin Oluştur →
        </Link>
      </div>
    )
  }

  const esnaf = kullanici.esnaf
  const buAyGoruntulenme = esnaf.istatistikler.reduce((s, i) => s + i.goruntulenme, 0)
  const toplamRandevu = esnaf.randevular.length
  const ortalamaPuan = esnaf.yorumlar.length
    ? (esnaf.yorumlar.reduce((s, y) => s + y.puan, 0) / esnaf.yorumlar.length).toFixed(1)
    : '—'
  const whatsappT = esnaf.istatistikler.reduce((s, i) => s + i.whatsappT, 0)
  const bekleyenRandevu = esnaf.randevular.filter((r) => r.durum === 'BEKLIYOR').length
  const vitrinUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-slate-800 to-indigo-900 rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-24 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-2">
            İşletme Panelinize Hoş Geldiniz
          </p>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
            {esnaf.isletmeAdi} 👋
          </h1>
          <p className="text-slate-300 text-sm max-w-lg">
            {bekleyenRandevu > 0
              ? `Bugün ${bekleyenRandevu} bekleyen randevunuz var. Hızlıca yönetin.`
              : 'Tüm randevular güncel. Vitrininizi büyütmeye devam edin!'}
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link href="/isletme/randevular">
              <button className="h-10 px-5 text-sm font-bold bg-white text-slate-800 rounded-xl hover:bg-slate-50 transition-colors">
                Randevuları Gör
              </button>
            </Link>
            <a href={vitrinUrl} target="_blank" rel="noopener noreferrer">
              <button className="h-10 px-5 text-sm font-semibold bg-white/15 text-white border border-white/25 rounded-xl hover:bg-white/20 transition-colors">
                Vitrine Git ↗
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { baslik: 'Bu Ay Görüntülenme', deger: buAyGoruntulenme, ikon: '👁', renk: '#4f46e5' },
          { baslik: 'Toplam Randevu', deger: toplamRandevu, ikon: '📅', renk: '#059669' },
          { baslik: 'Ortalama Puan', deger: ortalamaPuan, ikon: '⭐', renk: '#d97706' },
          { baslik: 'WhatsApp Tıklaması', deger: whatsappT, ikon: '💬', renk: '#0891b2' },
        ].map((k) => (
          <div key={k.baslik} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{k.baslik}</p>
                <p className="text-2xl font-bold mt-1 font-display" style={{ color: k.renk }}>{k.deger}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${k.renk}18` }}>
                {k.ikon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Son Randevular */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold font-display text-slate-800">Son Randevular</h3>
            <Link href="/isletme/randevular">
              <Button variant="ghost" size="sm">Tümü →</Button>
            </Link>
          </div>
          {esnaf.randevular.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-slate-500 text-sm mb-4">Henüz randevu yok.</p>
              <Link href="/isletme/ayarlar/vitrin">
                <Button size="sm">Vitrinini Öne Çıkar</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {esnaf.randevular.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-800">{r.musteriAd}</td>
                    <td className="px-6 py-3 text-slate-500">{formatTarih(r.tarih.toISOString())}</td>
                    <td className="px-6 py-3">
                      <Badge variant={r.durum === 'ONAYLANDI' ? 'success' : r.durum === 'IPTAL' ? 'danger' : 'warning'}>
                        {r.durum}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* QR Kod */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold font-display text-slate-800">Vitrin QR Kodu</h3>
          </div>
          <div className="p-6 flex flex-col items-center gap-3">
            <QRKodWidget url={vitrinUrl} boyut={120} />
            <p className="text-xs text-slate-400 text-center">Müşterilerinizle paylaşın</p>
            <a
              href={vitrinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 font-semibold hover:underline"
            >
              🔗 Vitrine Git ↗
            </a>
          </div>
        </div>
      </div>

      {/* Hızlı Eylemler */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold font-display text-slate-800">Hızlı Eylemler</h3>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {HIZLI_EYLEMLER.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${e.renk}15` }}
              >
                {e.ikon}
              </div>
              <p className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 leading-tight">{e.baslik}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
