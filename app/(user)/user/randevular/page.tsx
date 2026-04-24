import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatTarih } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function UserRandevularPage() {
  const oturum = await auth()
  const name = oturum!.user!.name ?? undefined

  const randevular = await prisma.randevu.findMany({
    where: { musteriAd: name },
    include: {
      esnaf: { select: { isletmeAdi: true, slug: true, sehir: true } },
      hizmet: { select: { ad: true, fiyat: true } },
    },
    orderBy: { tarih: 'desc' },
  })

  const simdi = new Date()
  const yaklasan = randevular.filter((r) => new Date(r.tarih) >= simdi && r.durum !== 'IPTAL')
  const gecmis = randevular.filter((r) => new Date(r.tarih) < simdi || r.durum === 'IPTAL')

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        Randevularım
      </h1>

      <Bolum baslik="Yaklaşan Randevular" bos="Yaklaşan randevunuz yok.">
        {yaklasan.map((r) => (
          <RandevuKart key={r.id} r={r} />
        ))}
      </Bolum>

      {gecmis.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <Bolum baslik="Geçmiş Randevular" bos="">
            {gecmis.map((r) => (
              <RandevuKart key={r.id} r={r} solgun />
            ))}
          </Bolum>
        </div>
      )}
    </div>
  )
}

function Bolum({
  baslik,
  bos,
  children,
}: {
  baslik: string
  bos: string
  children: React.ReactNode
}) {
  const bosMu = Array.isArray(children) ? children.length === 0 : !children
  return (
    <section
      style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>
          {baslik}
        </h2>
      </div>
      <div style={{ padding: 24 }}>
        {bosMu && bos ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>{bos}</p>
            <Link href="/ara">
              <Button size="sm">Esnaf Keşfet</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
        )}
      </div>
    </section>
  )
}

function RandevuKart({
  r,
  solgun,
}: {
  r: {
    id: number
    tarih: Date
    durum: string
    esnaf: { isletmeAdi: string; slug: string; sehir: string }
    hizmet: { ad: string; fiyat: unknown } | null
  }
  solgun?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        gap: 12,
        opacity: solgun ? 0.7 : 1,
      }}
    >
      <div>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{r.esnaf.isletmeAdi}</p>
        {r.hizmet && (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            {r.hizmet.ad}
          </p>
        )}
        <p style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
          {formatTarih(r.tarih.toISOString())}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Badge
          variant={
            r.durum === 'ONAYLANDI'
              ? 'success'
              : r.durum === 'IPTAL'
                ? 'danger'
                : r.durum === 'TAMAMLANDI'
                  ? 'default'
                  : 'warning'
          }
        >
          {r.durum}
        </Badge>
        <Link href={`/musteri/${r.esnaf.sehir.toLowerCase()}/${r.esnaf.slug}`}>
          <Button variant="secondary" size="sm">
            İşletme
          </Button>
        </Link>
      </div>
    </div>
  )
}
