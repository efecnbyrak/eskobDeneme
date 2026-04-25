import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function RandevularimPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Randevularım
      </h1>
      <div className="card-elite" style={{ padding: 40, borderRadius: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          Henüz alınmış bir randevunuz bulunmuyor.
        </p>
      </div>
    </div>
  )
}
