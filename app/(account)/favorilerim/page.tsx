import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favorilerim | Müşteri Vitrin',
}

export default async function FavorilerimPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const userId = Number(session.user.id)

  const favoriler = await prisma.favori.findMany({
    where: { kullaniciId: userId },
    select: {
      id: true,
      olusturmaT: true,
      esnaf: {
        select: {
          isletmeAdi: true,
          sehir: true,
          slug: true,
          kapakFoto: true,
          kategori: { select: { ad: true, ikon: true } },
          yorumlar: { select: { puan: true } },
        },
      },
    },
    orderBy: { olusturmaT: 'desc' },
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 4 }}>
          Favorilerim
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>
          {favoriler.length} favori işletme
        </p>
      </div>

      {favoriler.length === 0 ? (
        <div
          style={{
            background: 'white', border: '1px solid #EBEBEB', borderRadius: 16,
            padding: '60px 24px', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
          <p style={{ fontSize: 16, color: '#888', fontWeight: 500, marginBottom: 16 }}>
            Henüz favori eklemedin.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {favoriler.map((f) => {
            const ortalamaPuan = f.esnaf.yorumlar.length
              ? (f.esnaf.yorumlar.reduce((t, y) => t + y.puan, 0) / f.esnaf.yorumlar.length).toFixed(1)
              : null
            return (
              <Link
                key={f.id}
                href={`/${f.esnaf.sehir.toLowerCase().replace(/\s/g, '-')}/${f.esnaf.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'white', border: '1px solid #EBEBEB', borderRadius: 16,
                    overflow: 'hidden', transition: 'box-shadow 0.15s, transform 0.15s',
                  }}
                  className="hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    style={{
                      height: 100,
                      background: f.esnaf.kapakFoto
                        ? `url(${f.esnaf.kapakFoto}) center/cover`
                        : '#F5F6F8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {!f.esnaf.kapakFoto && (
                      <span style={{ fontSize: 36 }}>{f.esnaf.kategori?.ikon ?? '🏪'}</span>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#222', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.esnaf.isletmeAdi}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: 12, color: '#999' }}>{f.esnaf.sehir}</p>
                      {ortalamaPuan && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>⭐ {ortalamaPuan}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
