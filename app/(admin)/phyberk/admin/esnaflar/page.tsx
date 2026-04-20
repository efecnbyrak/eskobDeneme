import { prisma } from '@/lib/db'
import { EsnafSatir } from './EsnafSatir'

export const dynamic = 'force-dynamic'

export default async function EsnaflarPage() {
  const esnaflar = await prisma.esnaf.findMany({
    orderBy: { olusturmaT: 'desc' },
    include: {
      kategori: { select: { ad: true, ikon: true } },
      sahip: { select: { email: true, ad: true, soyad: true } },
    },
  })

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        İşletmeler
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Toplam {esnaflar.length} işletme.
      </p>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-muted)', textAlign: 'left' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>İşletme</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Sahip</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Konum</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {esnaflar.map((e) => (
                <EsnafSatir
                  key={e.id}
                  esnaf={{
                    id: e.id,
                    isletmeAdi: e.isletmeAdi,
                    slug: e.slug,
                    sehir: e.sehir,
                    ilce: e.ilce,
                    aktif: e.aktif,
                    onayli: e.onaylı,
                    kategori: e.kategori,
                    sahip: e.sahip,
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
