import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function FavorilerPage() {
  const oturum = await auth()
  const userId = oturum!.user!.id!

  const favoriler = await prisma.favori.findMany({
    where: { kullaniciId: userId },
    include: {
      esnaf: {
        include: { kategori: true },
      },
    },
    orderBy: { olusturmaT: 'desc' },
  })

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        Favori Esnaflarım
      </h1>

      {favoriler.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'var(--color-bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
            }}
          >
            ❤️
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Henüz favoriniz yok
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
            Beğendiğiniz esnafları favorilerinize ekleyerek kolayca ulaşabilirsiniz.
          </p>
          <Link href="/ara">
            <Button>Esnaf Keşfet</Button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {favoriler.map((f) => (
            <Link
              key={f.id}
              href={`/${f.esnaf.sehir.toLowerCase()}/${f.esnaf.slug}`}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                padding: 20,
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                transition: 'transform 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{f.esnaf.kategori.ikon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{f.esnaf.isletmeAdi}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {f.esnaf.kategori.ad}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                📍 {f.esnaf.sehir}, {f.esnaf.ilce}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
