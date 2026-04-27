import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ayarlar | Müşteri Vitrin',
}

export default async function AyarlarPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 4 }}>
          Ayarlar
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>Hesap ayarlarÄ±nÄ± buradan yÃ¶netebilirsin.</p>
      </div>

      <div
        style={{
          background: 'white', border: '1px solid #EBEBEB', borderRadius: 16,
          padding: '32px', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>âš™ï¸</div>
        <p style={{ fontSize: 15, color: '#888', fontWeight: 500 }}>
          Ayarlar sayfasÄ± yakÄ±nda aktif olacak.
        </p>
      </div>
    </div>
  )
}
