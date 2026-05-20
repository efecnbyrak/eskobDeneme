import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OnizlemeSayfasiClient } from './OnizlemeSayfasiClient'

export default async function OnizlemeSayfasi() {
  const oturum = await auth()
  if (!oturum?.user) redirect('/isletme/giris')

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email! },
    include: { esnaf: { select: { sehir: true, slug: true, isletmeAdi: true } } },
  })

  const esnaf = kullanici?.esnaf

  if (!esnaf) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🏪</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12 }}>
          İşletme Bulunamadı
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
          Ön izleme yapabilmek için önce bir işletme profili oluşturmanız gerekiyor.
        </p>
        <Link
          href="/isletme/panel/vitrin"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12,
            background: 'var(--color-primary)', color: 'white',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}
        >
          Vitrin Oluştur
        </Link>
      </div>
    )
  }

  const sayfaUrl = `/${esnaf.sehir.toLowerCase()}/${esnaf.slug}`

  return (
    <OnizlemeSayfasiClient
      sayfaUrl={sayfaUrl}
      isletmeAdi={esnaf.isletmeAdi}
    />
  )
}
