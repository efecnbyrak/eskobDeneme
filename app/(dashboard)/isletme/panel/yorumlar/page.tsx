import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'

export default async function YorumlarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: { yorumlar: { orderBy: { olusturmaT: 'desc' } } },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/kayit')

  const yorumlar = kullanici.esnaf.yorumlar

  return (
    <div>
      <TopBar baslik="Yorumlar" aciklama={`Toplam ${yorumlar.length} yorum`} />

      {yorumlar.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)] py-16">Henüz yorum yok.</p>
      ) : (
        <div className="space-y-3">
          {yorumlar.map((y: typeof yorumlar[0]) => (
            <Card key={y.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{y.musteriAd}</p>
                      <Badge variant={y.onaylı ? 'success' : 'warning'}>
                        {y.onaylı ? 'Onaylı' : 'Bekliyor'}
                      </Badge>
                    </div>
                    {y.yorum && <p className="text-sm text-[var(--color-text-secondary)]">{y.yorum}</p>}
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {formatTarih(y.olusturmaT.toISOString())}
                    </p>
                  </div>
                  <YildizPuan puan={y.puan} boyut="sm" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
