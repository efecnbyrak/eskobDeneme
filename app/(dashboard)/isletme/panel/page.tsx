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
import { QuickActionCard } from '@/components/dashboard/QuickActionCard'
import { formatTarih, formatFiyat } from '@/lib/utils'

const HIZLI_EYLEMLER = [
  { href: '/isletme/panel/hizmetler', ikon: '➕', baslik: 'Hizmet Ekle', aciklama: 'Yeni hizmet veya fiyat ekle', renk: '#1A2744' },
  { href: '/isletme/panel/vitrin', ikon: '🖼️', baslik: 'Vitrin Düzenle', aciklama: 'Fotoğraf ve görselleri güncelle', renk: '#3b82f6' },
  { href: '/isletme/panel/kampanyalar', ikon: '🏷️', baslik: 'Kampanyalar', aciklama: 'İndirim kampanyası oluştur', renk: '#f59e0b' },
  { href: '/isletme/panel/randevular', ikon: '📅', baslik: 'Randevular', aciklama: 'Bekleyen randevuları yönet', renk: '#10b981' },
  { href: '/isletme/panel/musteriler', ikon: '👥', baslik: 'Müşteriler', aciklama: 'Müşteri geçmişini incele', renk: '#0ea5e9' },
  { href: '/isletme/panel/yorumlar', ikon: '⭐', baslik: 'Yorumlar', aciklama: 'Yorumlara yanıt ver', renk: '#ef4444' },
  { href: '/isletme/panel/ayarlar', ikon: '⚙️', baslik: 'Ayarlar', aciklama: 'Hesap ve işletme bilgileri', renk: '#8b5cf6' },
]

export default async function PanelSayfasi() {
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
          hizmetler: { where: { aktif: true, indirimYuzde: { gt: 0 } }, orderBy: { sira: 'asc' } },
        },
      },
    },
  })

  if (!kullanici?.esnaf) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🏪</div>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12 }}>
          İşletme Kaydınızı Tamamlayın
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 480, lineHeight: 1.7, marginBottom: 32 }}>
          Henüz bir işletme profiliniz oluşturulmamış. Vitrinizi kurmak ve müşteri kazanmaya başlamak için işletme bilgilerinizi ekleyin.
        </p>
        <a
          href="/isletme/panel/vitrin"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            height: 52, padding: '0 32px', fontSize: 16, fontWeight: 700,
            background: 'var(--color-primary)', color: 'white',
            borderRadius: 14, textDecoration: 'none', boxShadow: 'var(--shadow-sm)',
          }}
        >
          Vitrin Oluştur →
        </a>
      </div>
    )
  }

  const esnaf = kullanici.esnaf
  const simdiki = new Date()
  const aktifKampanyalar = esnaf.hizmetler.filter(
    (h: { indirimYuzde: number | null; indirimBitis: Date | null }) =>
      h.indirimYuzde && h.indirimBitis && new Date(h.indirimBitis) > simdiki
  )
  const buAyGoruntulenme = esnaf.istatistikler.reduce((s: number, i: { goruntulenme: number }) => s + i.goruntulenme, 0)
  const toplamRandevu = esnaf.randevular.length
  const ortalamaPuan = esnaf.yorumlar.length
    ? (esnaf.yorumlar.reduce((s: number, y: { puan: number }) => s + y.puan, 0) / esnaf.yorumlar.length).toFixed(1)
    : '—'
  const whatsappT = esnaf.istatistikler.reduce((s: number, i: { whatsappT: number }) => s + i.whatsappT, 0)
  const bekleyenRandevu = esnaf.randevular.filter((r: { durum: string }) => r.durum === 'BEKLIYOR').length

  const vitrinUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A2744 0%, #243260 100%)',
          borderRadius: 20,
          padding: '32px 36px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 80, width: 150, height: 150, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            İşletme Panelinize Hoş Geldiniz
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: 'white', marginBottom: 10 }}>
            {esnaf.isletmeAdi} 👋
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>
            {bekleyenRandevu > 0
              ? `Bugün ${bekleyenRandevu} bekleyen randevunuz var. Hızlıca yönetin.`
              : 'Tüm randevular güncel. Vitrininizi büyütmeye devam edin!'}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link href="/isletme/panel/randevular">
              <button style={{ height: 40, padding: '0 20px', fontSize: 14, fontWeight: 700, background: 'white', color: '#1A2744', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                Randevuları Gör
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrik Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <IstatistikKart baslik="Bu Ay Görüntülenme" deger={buAyGoruntulenme} ikon="👁" />
        <IstatistikKart baslik="Toplam Randevu" deger={toplamRandevu} ikon="📅" renk="var(--color-success)" />
        <IstatistikKart baslik="Ortalama Puan" deger={ortalamaPuan} ikon="⭐" renk="#F59E0B" />
        <IstatistikKart baslik="WhatsApp Tıklaması" deger={whatsappT} ikon="💬" renk="var(--color-turquoise)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Son Randevular */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Son Randevular</h3>
              <Link href="/isletme/panel/randevular">
                <Button variant="ghost" size="sm">Tümü →</Button>
              </Link>
            </div>
            <CardBody className="p-0">
              {esnaf.randevular.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 16 }}>Henüz randevu yok.</p>
                  <Link href="/isletme/panel/vitrin">
                    <Button size="sm">Vitrinini Öne Çıkar</Button>
                  </Link>
                </div>
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

        {/* QR Kod + Vitrin Linki */}
        <div className="space-y-4">
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Vitrin QR Kodu</h3>
            </div>
            <CardBody className="flex flex-col items-center gap-3">
              <QRKodWidget url={vitrinUrl} boyut={120} />
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                Bu QR kodu müşterilerinizle paylaşın
              </p>
              <a href={vitrinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#1A2744', fontWeight: 600, textDecoration: 'none' }}>
                🔗 Vitrine Git ↗
              </a>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Kampanyalar */}
      <Card className="mb-6">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Aktif Kampanyalar</h3>
          <Link href="/isletme/panel/kampanyalar">
            <Button variant="ghost" size="sm">Yönet →</Button>
          </Link>
        </div>
        <CardBody>
          {aktifKampanyalar.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🏷️</div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 16 }}>Henüz aktif kampanya yok.</p>
              <Link href="/isletme/panel/kampanyalar">
                <Button size="sm">Kampanya Oluştur</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {aktifKampanyalar.map((h: { id: number; ad: string; fiyat: { toString: () => string }; indirimYuzde: number | null; indirimBitis: Date | null }) => (
                <div key={h.id} className="flex items-center justify-between gap-4 px-2 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{h.ad}</span>
                    <Badge variant="success">%{h.indirimYuzde ?? 0} İndirim</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="line-through text-[var(--color-text-secondary)]">{formatFiyat(Number(h.fiyat))}</span>
                    <span className="font-bold text-green-600">{formatFiyat(Number(h.fiyat) * (1 - (h.indirimYuzde ?? 0) / 100))}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">→ {h.indirimBitis ? new Date(h.indirimBitis).toLocaleDateString('tr-TR') : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Hızlı Eylemler */}
      <Card>
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Hızlı Eylemler</h3>
        </div>
        <CardBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {HIZLI_EYLEMLER.map((e) => (
              <QuickActionCard key={e.href} {...e} />
            ))}
          </div>
        </CardBody>
      </Card>

    </div>
  )
}
