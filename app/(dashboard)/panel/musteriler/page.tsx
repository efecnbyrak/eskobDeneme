import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { formatTarih } from '@/lib/utils'

export default async function MusterilerSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { include: { randevular: { orderBy: { olusturmaT: 'desc' } } } } },
  })

  if (!kullanici?.esnaf) redirect('/kayit')
  const esnaf = kullanici.esnaf!

  type Musteri = { ad: string; tel: string; son: string; sayi: number }
  const benzersizMusteriler: Musteri[] = Object.values(
    esnaf.randevular.reduce<Record<string, Musteri>>((acc: Record<string, Musteri>, r: typeof esnaf.randevular[0]) => {
      const key = r.musteriTelefon
      if (!acc[key]) {
        acc[key] = { ad: r.musteriAd, tel: r.musteriTelefon, son: r.tarih.toISOString(), sayi: 0 }
      }
      acc[key].sayi++
      return acc
    }, {})
  )

  return (
    <div>
      <TopBar baslik="Müşteriler" aciklama={`${benzersizMusteriler.length} benzersiz müşteri`} />

      {benzersizMusteriler.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)] py-16">Henüz müşteri yok.</p>
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-3 font-medium text-[var(--color-text-secondary)]">Müşteri</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--color-text-secondary)]">Telefon</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--color-text-secondary)]">Randevu Sayısı</th>
                <th className="text-left px-6 py-3 font-medium text-[var(--color-text-secondary)]">Son Randevu</th>
              </tr>
            </thead>
            <tbody>
              {benzersizMusteriler.map((m) => (
                <tr key={m.tel} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-muted)]">
                  <td className="px-6 py-3 font-medium">{m.ad}</td>
                  <td className="px-6 py-3">{m.tel}</td>
                  <td className="px-6 py-3">{m.sayi}</td>
                  <td className="px-6 py-3 text-[var(--color-text-secondary)]">{formatTarih(m.son)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
