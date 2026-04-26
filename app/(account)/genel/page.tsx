import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Genel Bakış | Esnaf Vitrin',
}

export default async function GenelPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const userId = Number(session.user.id)

  const [favoriSayisi, randevuSayisi, yorumSayisi, sonFavoriler, yaklasanRandevular] =
    await Promise.all([
      prisma.favori.count({ where: { kullaniciId: userId } }),
      prisma.randevu.count({
        where: {
          kullaniciId: userId,
          tarih: { gte: new Date() },
          durum: { in: ['BEKLIYOR', 'ONAYLANDI'] },
        },
      }),
      prisma.yorum.count({ where: { kullaniciId: userId } }),
      prisma.favori.findMany({
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
            },
          },
        },
        orderBy: { olusturmaT: 'desc' },
        take: 4,
      }),
      prisma.randevu.findMany({
        where: {
          kullaniciId: userId,
          tarih: { gte: new Date() },
          durum: { in: ['BEKLIYOR', 'ONAYLANDI'] },
        },
        select: {
          id: true,
          tarih: true,
          sure: true,
          durum: true,
          esnaf: { select: { isletmeAdi: true, sehir: true, slug: true } },
        },
        orderBy: { tarih: 'asc' },
        take: 4,
      }),
    ])

  const STATS = [
    { icon: '❤️', label: 'Favorilerim', value: favoriSayisi, href: '/favorilerim', renk: '#EF4444' },
    { icon: '📅', label: 'Yaklaşan Randevu', value: randevuSayisi, href: '/randevularim', renk: '#F7620A' },
    { icon: '⭐', label: 'Yorumlarım', value: yorumSayisi, href: '/yorumlarim', renk: '#F59E0B' },
  ]

  return (
    <div>
      {/* Başlık */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 4 }}>
          Hoş geldin, {session.user.ad}! 👋
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>
          Hesap özetine buradan ulaşabilirsin.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
        {STATS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'white',
                border: '1px solid #EBEBEB',
                borderRadius: 16,
                padding: '20px 24px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                cursor: 'pointer',
              }}
              className="hover:-translate-y-0.5 hover:shadow-md"
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.renk, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Son Favoriler */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>Son Favorilerin</h2>
          <Link href="/favorilerim" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
            Tümünü Gör →
          </Link>
        </div>
        {sonFavoriler.length === 0 ? (
          <div
            style={{
              background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
              padding: '32px', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>❤️</div>
            <p style={{ fontSize: 14, color: '#888' }}>Henüz favori eklemedin.</p>
            <Link href="/ara" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
              İşletmeleri Keşfet →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {sonFavoriler.map((f) => (
              <Link
                key={f.id}
                href={`/${f.esnaf.sehir.toLowerCase().replace(/\s/g, '-')}/${f.esnaf.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
                    overflow: 'hidden', transition: 'box-shadow 0.15s',
                  }}
                  className="hover:shadow-md"
                >
                  <div
                    style={{
                      height: 80, background: f.esnaf.kapakFoto ? `url(${f.esnaf.kapakFoto}) center/cover` : '#F5F6F8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {!f.esnaf.kapakFoto && (
                      <span style={{ fontSize: 28 }}>{f.esnaf.kategori?.ikon ?? '🏪'}</span>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.esnaf.isletmeAdi}
                    </p>
                    <p style={{ fontSize: 12, color: '#999' }}>{f.esnaf.sehir}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Yaklaşan Randevular */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>Yaklaşan Randevuların</h2>
          <Link href="/randevularim" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
            Tümünü Gör →
          </Link>
        </div>
        {yaklasanRandevular.length === 0 ? (
          <div
            style={{
              background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
              padding: '32px', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
            <p style={{ fontSize: 14, color: '#888' }}>Yaklaşan randevun bulunmuyor.</p>
            <Link href="/ara" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Randevu Al →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {yaklasanRandevular.map((r) => {
              const tarih = new Date(r.tarih)
              const DURUM_RENK: Record<string, string> = {
                BEKLIYOR: '#F59E0B',
                ONAYLANDI: '#10B981',
              }
              return (
                <div
                  key={r.id}
                  style={{
                    background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
                    padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: '#FFF4EE', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                      {tarih.getDate()}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#F7931E', textTransform: 'uppercase' }}>
                      {tarih.toLocaleString('tr-TR', { month: 'short' })}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#222', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.esnaf.isletmeAdi}
                    </p>
                    <p style={{ fontSize: 12, color: '#888' }}>
                      {tarih.toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit' })} · {r.sure} dk
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                      background: `${DURUM_RENK[r.durum] ?? '#999'}18`,
                      color: DURUM_RENK[r.durum] ?? '#999',
                    }}
                  >
                    {r.durum === 'BEKLIYOR' ? 'Bekliyor' : 'Onaylandı'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
