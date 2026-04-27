import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminAnaSayfa() {
  const [kullaniciSay, esnafSay, randevuSay, bekleyenOnay] = await Promise.all([
    prisma.kullanici.count(),
    prisma.esnaf.count(),
    prisma.randevu.count(),
    prisma.esnaf.count({ where: { onaylı: false } }),
  ])

  const rolDagilim = await prisma.kullanici.groupBy({
    by: ['rol'],
    _count: { rol: true },
  })

  const sonKullanicilar = await prisma.kullanici.findMany({
    orderBy: { olusturmaT: 'desc' },
    take: 8,
    select: {
      id: true,
      ad: true,
      soyad: true,
      email: true,
      rol: true,
      olusturmaT: true,
    },
  })

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        Genel Bakış
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard label="Toplam Kullanıcı" deger={kullaniciSay} ikon="👥" />
        <MetricCard label="Toplam İşletme" deger={esnafSay} ikon="🏪" />
        <MetricCard label="Toplam Randevu" deger={randevuSay} ikon="📅" />
        <MetricCard
          label="Bekleyen Onay"
          deger={bekleyenOnay}
          ikon="⏳"
          vurgu={bekleyenOnay > 0}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        <section
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            padding: 24,
          }}
        >
          <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Rol Dağılımı
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rolDagilim.map((r) => (
              <div
                key={r.rol}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r.rol}</span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 9999,
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {r._count.rol}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            padding: 24,
          }}
        >
          <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Son Kayıtlar
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sonKullanicilar.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                Henüz kullanıcı yok.
              </p>
            ) : (
              sonKullanicilar.map((k) => (
                <div
                  key={k.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>
                      {k.ad} {k.soyad}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{k.email}</p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    {k.rol}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  deger,
  ikon,
  vurgu,
}: {
  label: string
  deger: number
  ikon: string
  vurgu?: boolean
}) {
  return (
    <div
      style={{
        background: 'white',
        border: `1px solid ${vurgu ? '#F59E0B' : 'var(--color-border)'}`,
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
