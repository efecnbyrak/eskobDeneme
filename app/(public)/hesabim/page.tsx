import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatTarih } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Hesabım - Randevularım | Esnaf Vitrin',
}

export default async function HesabimPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=/hesabim')
  }

  const randevular = await prisma.randevu.findMany({
    where: {
      musteriAd: session.user.name || undefined,
    },
    include: {
      esnaf: { select: { isletmeAdi: true, sehir: true, ilce: true, slug: true } },
      hizmet: { select: { ad: true, fiyat: true } }
    },
    orderBy: { tarih: 'desc' },
  })

  const upcoming = randevular.filter(r => new Date(r.tarih) >= new Date() && r.durum !== 'IPTAL')
  const past = randevular.filter(r => new Date(r.tarih) < new Date() || r.durum === 'IPTAL')

  return (
    <div className="container-main" style={{ paddingTop: '48px', paddingBottom: '48px', minHeight: '60vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700 }}>Hesabım</h1>
          <Link href="/panel">
            <Button variant="ghost" size="sm">İşletme Paneline Git</Button>
          </Link>
        </div>

        {/* Upcoming */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="font-display" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Yaklaşan Randevularım</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Aktif ve onaylanmış randevularınızı buradan takip edebilirsiniz.</p>
          </div>
          
          <div style={{ padding: '24px 32px' }}>
            {upcoming.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {upcoming.map((randevu) => (
                  <div key={randevu.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '16px', gap: '16px', transition: 'box-shadow 0.2s' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{randevu.esnaf.isletmeAdi}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{randevu.hizmet?.ad} - {randevu.hizmet?.fiyat ? `₺${randevu.hizmet.fiyat.toString()}` : ''}</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>{formatTarih(randevu.tarih)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <Badge variant={randevu.durum === 'ONAYLANDI' ? 'success' : 'default'}>
                        {randevu.durum}
                      </Badge>
                      <Link href={`/${randevu.esnaf.sehir.toLowerCase()}/${randevu.esnaf.slug}`}>
                        <Button variant="secondary" size="sm">İşletmeye Git</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ width: 80, height: 80, background: 'var(--color-bg-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>
                  🗓️
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Yaklaşan Randevunuz Yok</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '15px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 32px' }}>Hemen işletmeleri keşfedin ve ilk randevunuzu oluşturun.</p>
                <Link href="/ara">
                  <Button>Esnaf Keşfet</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div style={{ marginTop: '40px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 className="font-display" style={{ fontSize: '20px', fontWeight: 700 }}>Geçmiş Randevular</h2>
            </div>
            <div style={{ padding: '24px 32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {past.map((randevu) => (
                  <div key={randevu.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '16px', gap: '16px', opacity: 0.7 }}>
                    <div>
                      <h3 style={{ fontWeight: 500, fontSize: '15px', marginBottom: '4px' }}>{randevu.esnaf.isletmeAdi}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{randevu.hizmet?.ad}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{formatTarih(randevu.tarih)}</p>
                    </div>
                    <Badge variant={randevu.durum === 'IPTAL' ? 'danger' : 'default'}>
                      {randevu.durum}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
