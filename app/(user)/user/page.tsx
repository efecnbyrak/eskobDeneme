import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function UserAnaSayfa() {
  const oturum = await auth()
  const userId = oturum!.user!.id!

  const [favoriSay, randevuSay, yaklasan] = await Promise.all([
    prisma.favori.count({ where: { kullaniciId: parseInt(userId) } }),
    prisma.randevu.count({
      where: { musteriAd: oturum!.user!.name ?? undefined },
    }),
    prisma.randevu.findMany({
      where: {
        musteriAd: oturum!.user!.name ?? undefined,
        tarih: { gte: new Date() },
        durum: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      },
      include: { esnaf: { select: { isletmeAdi: true, slug: true, sehir: true } } },
      orderBy: { tarih: 'asc' },
      take: 3,
    }),
  ])

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800 }}>
          Merhaba, {oturum!.user!.name ?? 'kullanıcı'} 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
          Randevularınızı, favorilerinizi ve hesap ayarlarınızı buradan yönetin.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard label="Aktif Randevu" deger={yaklasan.length} ikon="📅" />
        <StatCard label="Toplam Randevu" deger={randevuSay} ikon="📊" />
        <StatCard label="Favori Esnaf" deger={favoriSay} ikon="❤️" />
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-semibold font-display">Yaklaşan Randevularım</h2>
          <Link href="/user/randevular">
            <Button variant="ghost" size="sm">
              Tümü →
            </Button>
          </Link>
        </div>
        <CardBody>
          {yaklasan.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                Yaklaşan randevunuz yok.
              </p>
              <Link href="/ara">
                <Button size="sm">Esnaf Keşfet</Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {yaklasan.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    border: '1px solid var(--color-border)',
                    borderRadius: 12,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{r.esnaf.isletmeAdi}</p>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {new Date(r.tarih).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <Link href={`/${r.esnaf.sehir.toLowerCase()}/${r.esnaf.slug}`}>
                    <Button variant="secondary" size="sm">
                      Görüntüle
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({ label, deger, ikon }: { label: string; deger: number; ikon: string }) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        padding: 20,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{ikon}</span>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <p className="font-display" style={{ fontSize: 28, fontWeight: 800 }}>
        {deger}
      </p>
    </div>
  )
}
