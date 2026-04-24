import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

const YILDIZLAR = [1, 2, 3, 4, 5]

export default async function YorumlarPage() {
  const oturum = await auth()
  const musteriAd = oturum!.user!.name ?? ''

  const yorumlar = await prisma.yorum.findMany({
    where: { musteriAd },
    include: {
      esnaf: { select: { isletmeAdi: true, slug: true, sehir: true } },
    },
    orderBy: { olusturmaT: 'desc' },
  })

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        Yorumlarım
      </h1>

      {yorumlar.length === 0 ? (
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
          <p style={{ fontSize: 40, marginBottom: 16 }}>⭐</p>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Henüz yorum yapmadınız</p>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: 14 }}>
            Randevu aldığınız işletmelere yorum bırakabilirsiniz.
          </p>
          <Link href="/ara">
            <Button size="sm">Esnaf Keşfet</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {yorumlar.map((y) => (
            <div
              key={y.id}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{y.esnaf.isletmeAdi}</p>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {YILDIZLAR.map((s) => (
                      <span key={s} style={{ color: s <= y.puan ? '#F59E0B' : '#E5E7EB', fontSize: 16 }}>★</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {new Date(y.olusturmaT).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <Link href={`/musteri/${y.esnaf.sehir.toLowerCase()}/${y.esnaf.slug}`}>
                    <Button variant="secondary" size="sm">İşletme</Button>
                  </Link>
                </div>
              </div>
              {y.yorum && (
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{y.yorum}</p>
              )}
              {!y.onaylı && (
                <p style={{ fontSize: 12, color: '#D97706', marginTop: 8, fontWeight: 500 }}>
                  ⏳ Onay bekliyor
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
