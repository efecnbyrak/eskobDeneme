import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yorumlarım | Esnaf Vitrin',
}

export default async function YorumlarimPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const userId = Number(session.user.id)

  const yorumlar = await prisma.yorum.findMany({
    where: { kullaniciId: userId },
    select: {
      id: true,
      puan: true,
      yorum: true,
      olusturmaT: true,
      onaylı: true,
      esnaf: { select: { isletmeAdi: true, sehir: true, slug: true } },
    },
    orderBy: { olusturmaT: 'desc' },
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 4 }}>
          Yorumlarım
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>{yorumlar.length} yorum yaptın</p>
      </div>

      {yorumlar.length === 0 ? (
        <div
          style={{
            background: 'white', border: '1px solid #EBEBEB', borderRadius: 16,
            padding: '60px 24px', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
          <p style={{ fontSize: 16, color: '#888', fontWeight: 500, marginBottom: 16 }}>
            Henüz bir yorum yapmadın.
          </p>
          <Link
            href="/ara"
            style={{
              display: 'inline-block',
              background: 'var(--color-primary)', color: 'white',
              fontWeight: 700, fontSize: 14,
              padding: '10px 24px', borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            İşletmeleri Keşfet
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {yorumlar.map((y) => (
            <div
              key={y.id}
              style={{
                background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <Link
                    href={`/${y.esnaf.sehir.toLowerCase().replace(/\s/g, '-')}/${y.esnaf.slug}`}
                    style={{ fontSize: 15, fontWeight: 700, color: '#222', textDecoration: 'none' }}
                  >
                    {y.esnaf.isletmeAdi}
                  </Link>
                  <p style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                    {new Date(y.olusturmaT).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#F59E0B' }}>
                    {'⭐'.repeat(y.puan)}
                  </span>
                  {!y.onaylı && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706', background: '#FEF3C7', padding: '2px 8px', borderRadius: 999 }}>
                      Onay bekliyor
                    </span>
                  )}
                </div>
              </div>
              {y.yorum && (
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{y.yorum}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
