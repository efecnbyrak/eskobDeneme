import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { IstatistikKart } from '@/components/dashboard/IstatistikKart'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QRKodWidget } from '@/components/shared/QRKodWidget'
import { formatTarih } from '@/lib/utils'

export default async function PanelSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          istatistikler: { orderBy: { tarih: 'desc' }, take: 30 },
          randevular: { orderBy: { tarih: 'desc' }, take: 5, include: { hizmet: true } },
          yorumlar: { select: { puan: true } },
        },
      },
    },
  })

  if (!kullanici?.esnaf) {
    redirect('/kayit')
  }

  const esnaf = kullanici.esnaf
  const buAyGoruntulenme = esnaf.istatistikler.reduce((s: number, i: { goruntulenme: number }) => s + i.goruntulenme, 0)
  const toplamRandevu = esnaf.randevular.length
  const ortalamaPuan = esnaf.yorumlar.length
    ? (esnaf.yorumlar.reduce((s: number, y: { puan: number }) => s + y.puan, 0) / esnaf.yorumlar.length).toFixed(1)
    : '—'
  const whatsappT = esnaf.istatistikler.reduce((s: number, i: { whatsappT: number }) => s + i.whatsappT, 0)

  const vitrinUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  return (
    <div>
      <TopBar
        baslik={`Merhaba, ${kullanici.ad}! 👋`}
        aciklama={`Bugün ${esnaf.randevular.filter((r: { durum: string }) => r.durum === 'BEKLIYOR').length} bekleyen randevun var.`}
      />

      {/* Metrik Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <IstatistikKart baslik="Bu Ay Görüntülenme" deger={buAyGoruntulenme} ikon="👁" />
        <IstatistikKart baslik="Toplam Randevu" deger={toplamRandevu} ikon="📅" renk="var(--color-success)" />
        <IstatistikKart baslik="Ortalama Puan" deger={ortalamaPuan} ikon="⭐" renk="#F59E0B" />
        <IstatistikKart baslik="WhatsApp Tıklaması" deger={whatsappT} ikon="💬" renk="var(--color-turquoise)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Son Randevular */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Son Randevular</h3>
              <Link href="/panel/randevular">
                <Button variant="ghost" size="sm">Tümü →</Button>
              </Link>
            </div>
            <CardBody className="p-0">
              {esnaf.randevular.length === 0 ? (
                <p className="text-center text-[var(--color-text-secondary)] text-sm py-8">
                  Henüz randevu yok.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {esnaf.randevular.map((r: typeof esnaf.randevular[0]) => (
                      <tr key={r.id} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="px-6 py-3 font-medium">{r.musteriAd}</td>
                        <td className="px-6 py-3 text-[var(--color-text-secondary)]">{formatTarih(r.tarih.toISOString())}</td>
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
            </CardBody>
          </Card>
        </div>

        {/* Hızlı Eylemler + Vitrin */}
        <div className="space-y-4">
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Hızlı Eylemler</h3>
            </div>
            <CardBody>
              <div className="space-y-2">
                <Link href="/panel/hizmetler" className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)] transition-colors text-sm">
                  <span>➕</span> Hizmet Ekle
                </Link>
                <Link href="/panel/vitrin" className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)] transition-colors text-sm">
                  <span>🖼</span> Fotoğraf Ekle
                </Link>
                <a href={vitrinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)] transition-colors text-sm">
                  <span>🔗</span> Vitrine Git ↗
                </a>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex justify-center">
              <QRKodWidget url={vitrinUrl} boyut={120} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
