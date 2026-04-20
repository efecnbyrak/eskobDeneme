import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProfilForm } from './ProfilForm'

export const dynamic = 'force-dynamic'

export default async function ProfilPage() {
  const oturum = await auth()
  const kullanici = await prisma.kullanici.findUnique({
    where: { id: parseInt(oturum!.user!.id!) },
    select: {
      id: true,
      email: true,
      ad: true,
      soyad: true,
      telefon: true,
      avatarUrl: true,
    },
  })

  if (!kullanici) return null

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Profilim
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Kişisel bilgilerinizi güncelleyin.
      </p>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: 32,
        }}
      >
        <ProfilForm kullanici={kullanici} />
      </div>
    </div>
  )
}
