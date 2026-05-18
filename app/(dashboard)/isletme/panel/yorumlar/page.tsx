import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card, CardBody } from '@/components/ui/Card'
import { YildizPuan } from '@/components/shared/YildizPuan'
import { formatTarih } from '@/lib/utils'
import { YorumBildirButon } from './YorumBildirButon'

export const dynamic = 'force-dynamic'

export default async function YorumlarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: {
      esnaf: {
        include: {
          yorumlar: {
            orderBy: { olusturmaT: 'desc' },
            select: {
              id: true,
              puan: true,
              yorum: true,
              musteriAd: true,
              yanitlar: true,
              bildirildi: true,
              olusturmaT: true,
            },
          },
        },
      },
    },
  })

  if (!kullanici?.esnaf) redirect('/kayit')

  const yorumlar = kullanici.esnaf.yorumlar

  function maskeAd(ad: string): string {
    return ad
      .split(' ')
      .map((kelime) => kelime.length > 1 ? kelime[0] + '*'.repeat(kelime.length - 1) : kelime)
      .join(' ')
  }

  return (
    <div>
      <TopBar baslik="Yorumlar" aciklama={`Toplam ${yorumlar.length} yorum`} />

      {yorumlar.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)] py-16">Henüz yorum yok.</p>
      ) : (
        <div className="space-y-3">
          {yorumlar.map((y) => (
            <Card key={y.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-sm">{maskeAd(y.musteriAd)}</p>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {formatTarih(y.olusturmaT.toISOString())}
                      </span>
                    </div>
                    {y.yorum && (
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{y.yorum}</p>
                    )}
                    {y.yanitlar && (
                      <div className="mt-2 pl-3 border-l-2 border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-600 mb-0.5">İşletme Yanıtı</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{y.yanitlar}</p>
                      </div>
                    )}
                    <div className="mt-3">
                      <YorumBildirButon yorumId={y.id} baslangicBildirildi={y.bildirildi} />
                    </div>
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
