import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function GenelPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Hesap Özeti
      </h1>
      <div className="card-elite" style={{ padding: 24, borderRadius: 16 }}>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          Hoş geldin, <strong style={{ color: 'var(--color-text)' }}>{session.user.ad} {session.user.soyad}</strong>
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Kullanıcı Adı: {session.user.kullaniciAdi || 'Belirtilmemiş'}
        </p>
      </div>
    </div>
  )
}
