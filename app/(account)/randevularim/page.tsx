import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Randevularım | Esnaf Vitrin',
}

export default async function RandevularimPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const userId = Number(session.user.id)
  const now = new Date()

  const [yaklasanlar, gecmisler] = await Promise.all([
    prisma.randevu.findMany({
      where: {
        kullaniciId: userId,
        tarih: { gte: now },
        durum: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      },
      select: {
        id: true, tarih: true, sure: true, durum: true,
        esnaf: { select: { isletmeAdi: true, sehir: true, slug: true } },
        hizmet: { select: { ad: true } },
      },
      orderBy: { tarih: 'asc' },
    }),
    prisma.randevu.findMany({
      where: {
        kullaniciId: userId,
        OR: [
          { tarih: { lt: now } },
          { durum: { in: ['IPTAL', 'TAMAMLANDI'] } },
        ],
      },
      select: {
        id: true, tarih: true, sure: true, durum: true,
        esnaf: { select: { isletmeAdi: true, sehir: true, slug: true } },
        hizmet: { select: { ad: true } },
      },
      orderBy: { tarih: 'desc' },
      take: 20,
    }),
  ])

  const DURUM_STILI: Record<string, { bg: string; color: string; label: string }> = {
    BEKLIYOR:    { bg: '#FEF3C720', color: '#D97706', label: 'Bekliyor' },
    ONAYLANDI:   { bg: '#D1FAE520', color: '#059669', label: 'Onaylandı' },
    IPTAL:       { bg: '#FEE2E220', color: '#DC2626', label: 'İptal' },
    TAMAMLANDI:  { bg: '#F3F4F620', color: '#6B7280', label: 'Tamamlandı' },
  }

  function RandevuKart({ r }: { r: typeof yaklasanlar[0] }) {
    const tarih = new Date(r.tarih)
    const durum = DURUM_STILI[r.durum] ?? DURUM_STILI.BEKLIYOR
    return (
      <div
        style={{
          background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16,
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#FFF4EE', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
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
            {r.hizmet && ` · ${r.hizmet.ad}`}
          </p>
        </div>
        <span
          style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
            background: durum.bg, color: durum.color,
            border: `1px solid ${durum.color}30`,
            flexShrink: 0,
          }}
        >
          {durum.label}
        </span>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 4 }}>
          Randevularım
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>Geçmiş ve yaklaşan randevuların</p>
      </div>

      {/* Yaklaşan */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Yaklaşan Randevular ({yaklasanlar.length})
        </h2>
        {yaklasanlar.length === 0 ? (
          <div
            style={{
              background: 'white', border: '1px solid #EBEBEB', borderRadius: 14,
              padding: '36px', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
            <p style={{ fontSize: 14, color: '#888' }}>Yaklaşan randevun yok.</p>
            <Link href="/ara" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Randevu Al →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {yaklasanlar.map((r) => <RandevuKart key={r.id} r={r} />)}
          </div>
        )}
      </section>

      {/* Geçmiş */}
      {gecmisler.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Geçmiş Randevular ({gecmisler.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {gecmisler.map((r) => <RandevuKart key={r.id} r={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
