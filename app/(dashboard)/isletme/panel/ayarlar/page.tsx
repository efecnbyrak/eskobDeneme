import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function AyarlarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
  })

  if (!kullanici) redirect('/giris')

  const planRenk: Record<string, 'default' | 'info' | 'success'> = { UCRETSIZ: 'default', STARTER: 'info', PRO: 'success' }

  return (
    <div>
      <TopBar baslik="Ayarlar" aciklama="Hesap ve plan bilgileri" />

      <div className="space-y-6 max-w-lg">
        <Card>
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Hesap Bilgileri</h3>
          </div>
          <CardBody>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Ad Soyad</span>
                <span className="font-medium">{kullanici.ad} {kullanici.soyad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">E-posta</span>
                <span className="font-medium">{kullanici.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Plan</span>
                <Badge variant={planRenk[kullanici.plan]}>{kullanici.plan}</Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Plan Yükselt</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              {[
                { plan: 'STARTER', fiyat: '₺99/ay', ozellikler: ['5 Hizmet', 'WhatsApp Butonu', 'Randevu Sistemi'] },
                { plan: 'PRO', fiyat: '₺249/ay', ozellikler: ['Sınırsız Hizmet', 'Öncelikli Listeleme', 'Analitik Rapor'] },
              ].map((p) => (
                <div key={p.plan} className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
                  <p className="font-bold text-[var(--color-primary)]">{p.plan}</p>
                  <p className="text-2xl font-bold my-2">{p.fiyat}</p>
                  <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                    {p.ozellikler.map((o) => <li key={o}>✓ {o}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-4 text-center">
              Ödeme sistemi yakında aktif olacak.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
