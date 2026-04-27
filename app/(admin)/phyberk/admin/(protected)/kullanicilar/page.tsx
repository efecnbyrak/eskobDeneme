import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { KullaniciSatir } from './KullaniciSatir'

export const dynamic = 'force-dynamic'

export default async function KullanicilarPage() {
  const oturum = await auth()
  const kendiId = oturum?.user?.id
  const superMi = oturum?.user?.rol === 'SUPER_ADMIN'

  const kullanicilar = await prisma.kullanici.findMany({
    orderBy: { olusturmaT: 'desc' },
    select: {
      id: true,
      ad: true,
      soyad: true,
      email: true,
      telefon: true,
      rol: true,
      olusturmaT: true,
    },
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          Kullanıcılar
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Toplam {kullanicilar.length} kullanıcı.
          {!superMi && ' (Rol değiştirme yetkiniz yok.)'}
        </p>
      </div>

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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Ad Soyad</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>E-posta</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Rol</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Kayıt</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {kullanicilar.map((k) => (
                <KullaniciSatir
                  key={k.id}
                  kullanici={{
                    ...k,
                    olusturmaT: k.olusturmaT.toISOString(),
                  }}
                  superMi={superMi}
                  kendiMi={String(k.id) === kendiId}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
