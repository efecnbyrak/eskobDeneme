import { prisma } from '@/lib/db'
import { KategoriIkonEditor } from './KategoriIkonEditor'

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
        Platformdaki {kategoriler.length} kategori — ikon yüklemek için karta tıkla.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {kategoriler.map((k) => (
          <KategoriIkonEditor
            key={k.id}
            id={k.id}
            ad={k.ad}
            slug={k.slug}
            ikon={k.ikon}
            ikonUrl={k.ikonUrl}
            renk={k.renk}
            esnafSayisi={k._count.esnaflar}
          />
        ))}
      </div>
    </div>
  )
}
