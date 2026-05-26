import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { CalismaSaatleriClient } from './CalismaSaatleriClient'

export const dynamic = 'force-dynamic'

export default async function CalismaSaatleriSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { select: { id: true, calismaS: true } } },
  })

  if (!kullanici?.esnaf) redirect('/isletme/genel')

  const calisma = (kullanici.esnaf.calismaS as Record<string, { acik: boolean; acilis: string; kapanis: string }> | null) ?? {}

  return (
    <CalismaSaatleriClient
      esnafId={kullanici.esnaf.id}
      baslangicSaatler={calisma}
    />
  )
}
