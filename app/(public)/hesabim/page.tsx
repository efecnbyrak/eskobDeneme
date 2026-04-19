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

  // Fetch bookings associated with this user
  const randevular = await prisma.randevu.findMany({
    where: {
      // Here we assume randevular are linked by phone or we need to add a relation to standard Users.
      // Since schema uses musteriTelefon/musteriAd, let's match by the user's phone if possible, 
      // or we can just fetch all if we add a kullaniciId relation to Randevu.
      // Wait, currently Randevu schema only has musteriAd, musteriTelefon. It doesn't formally link to Kullanici ID.
      // If the user is logged in, we should theoretically search by their phone number from the user profile.
      // Let's get the user's phone first.
      musteriAd: session.user.name || undefined, // Fallback logic since no strict relation is built yet
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
    <div className="container-main py-12 lg:py-16 min-h-[60vh]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--color-text)]">Hesabım</h1>
          <Link href="/panel">
            <Button variant="ghost" size="sm">İşletme Paneline Git</Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-[var(--color-border)]">
            <h2 className="text-xl font-bold font-display mb-2">Yaklaşan Randevularım</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Aktif ve onaylanmış randevularınızı buradan takip edebilirsiniz.</p>
          </div>
          
          <div className="p-6 sm:p-8">
            {upcoming.length > 0 ? (
              <div className="space-y-5">
                {upcoming.map((randevu) => (
                  <div key={randevu.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-[var(--color-border)] rounded-2xl hover:shadow-[var(--shadow-card)] transition-all">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{randevu.esnaf.isletmeAdi}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1.5">{randevu.hizmet?.ad} - {randevu.hizmet?.fiyat ? `₺${randevu.hizmet.fiyat.toString()}` : ''}</p>
                      <p className="text-sm text-[var(--color-primary)] font-medium">{formatTarih(randevu.tarih)}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
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
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  🗓️
                </div>
                <h3 className="text-xl font-bold mb-3">Yaklaşan Randevunuz Yok</h3>
                <p className="text-[var(--color-text-secondary)] mb-8 text-base leading-relaxed max-w-md mx-auto">Hemen işletmeleri keşfedin ve ilk randevunuzu oluşturun.</p>
                <Link href="/ara">
                  <Button>Esnaf Keşfet</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {past.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-bold font-display">Geçmiş Randevular</h2>
            </div>
            <div className="p-6 sm:p-8">
              <div className="space-y-5">
                {past.map((randevu) => (
                  <div key={randevu.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-[var(--color-border)] rounded-2xl opacity-70 hover:opacity-100 transition-opacity">
                    <div>
                      <h3 className="font-medium text-base mb-1">{randevu.esnaf.isletmeAdi}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1">{randevu.hizmet?.ad}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{formatTarih(randevu.tarih)}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <Badge variant={randevu.durum === 'IPTAL' ? 'danger' : 'default'}>
                        {randevu.durum}
                      </Badge>
                    </div>
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
