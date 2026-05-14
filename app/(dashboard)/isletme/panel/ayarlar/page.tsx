import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/dashboard/TopBar'
import { AyarlarClient } from '@/components/dashboard/AyarlarClient'

export default async function AyarlarSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: true },
  })

  if (!kullanici) redirect('/giris')

  return (
    <div>
      <TopBar baslik="Ayarlar" aciklama="Hesap, işletme ve plan bilgileri" />
      <AyarlarClient
        kullanici={{
          id: kullanici.id,
          ad: kullanici.ad,
          soyad: kullanici.soyad,
          email: kullanici.email,
          plan: kullanici.plan,
        }}
        esnaf={kullanici.esnaf ? {
          id: kullanici.esnaf.id,
          isletmeAdi: kullanici.esnaf.isletmeAdi,
          telefon: kullanici.esnaf.telefon ?? '',
          aciklama: kullanici.esnaf.aciklama ?? '',
          kapakFoto: kullanici.esnaf.kapakFoto ?? '',
          logoUrl: kullanici.esnaf.logoUrl ?? '',
        } : null}
      />
    </div>
  )
}
