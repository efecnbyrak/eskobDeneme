import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { AyarlarForm } from './AyarlarForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ayarlar | Müşteri Vitrin',
}

export default async function AyarlarPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const userId = Number(session.user.id)

  const kullanici = await prisma.kullanici.findUnique({
    where: { id: userId },
    select: { ad: true, soyad: true, email: true, telefon: true },
  })

  if (!kullanici) redirect('/giris')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 4 }}>
          Ayarlar
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>Profil bilgilerini ve şifreni buradan güncelleyebilirsin.</p>
      </div>

      <AyarlarForm initialData={kullanici} />
    </div>
  )
}
