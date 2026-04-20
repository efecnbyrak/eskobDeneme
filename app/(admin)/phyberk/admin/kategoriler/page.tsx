import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function KategorilerPage() {
  const kategoriler = await prisma.kategori.findMany({
    orderBy: { sira: 'asc' },
    include: { _count: { select: { esnaflar: true } } },
  })

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Kategoriler
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Platformdaki {kategoriler.length} kategori ve bağlı işletme sayıları.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {kategoriler.map((k) => (
          <div
            key={k.id}
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              padding: 20,
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${k.renk}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                fontSize: 22,
              }}
            >
              {k.ikon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{k.ad}</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>/{k.slug}</p>
            <p
              style={{
                marginTop: 12,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 700,
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                borderRadius: 9999,
                display: 'inline-block',
              }}
            >
              {k._count.esnaflar} işletme
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
