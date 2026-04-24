import { prisma } from '@/lib/db'
import { YorumSatir } from './YorumSatir'

export const dynamic = 'force-dynamic'

export default async function YorumlarPage() {
  const yorumlar = await prisma.yorum.findMany({
    orderBy: [{ onaylı: 'asc' }, { olusturmaT: 'desc' }],
    include: {
      esnaf: { select: { isletmeAdi: true, slug: true, sehir: true } },
      kullanici: { select: { ad: true, soyad: true, email: true } },
    },
  })

  const bekleyen = yorumlar.filter((y) => !y.onaylı).length

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Yorumlar
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        {bekleyen > 0 ? (
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>{bekleyen} bekleyen onay — </span>
        ) : null}
        Toplam {yorumlar.length} yorum.
      </p>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-muted)', textAlign: 'left' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Müşteri</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>İşletme</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Puan</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Yorum</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Tarih</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {yorumlar.map((y) => (
                <YorumSatir
                  key={y.id}
                  yorum={{
                    id: y.id,
                    musteriAd: y.musteriAd,
                    kullanici: y.kullanici,
                    esnaf: y.esnaf,
                    puan: y.puan,
                    yorum: y.yorum,
                    onaylı: y.onaylı,
                    olusturmaT: y.olusturmaT,
                  }}
                />
              ))}
            </tbody>
          </table>
          {yorumlar.length === 0 && (
            <p style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-secondary)' }}>
              Henüz yorum yok.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
