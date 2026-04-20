import { SifreForm } from './SifreForm'

export const dynamic = 'force-dynamic'

export default function AyarlarPage() {
  return (
    <div>
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Ayarlar
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Güvenlik ve hesap tercihlerinizi yönetin.
      </p>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: 32,
          marginBottom: 20,
        }}
      >
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Şifre Değiştir
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          Güvenliğiniz için güçlü bir şifre kullanın.
        </p>
        <SifreForm />
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: 32,
        }}
      >
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Oturum
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Hesabınızdan güvenli bir şekilde çıkış yapın.
        </p>
        <a
          href="/api/auth/signout"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 700,
            background: 'white',
            color: '#DC2626',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            textDecoration: 'none',
          }}
        >
          Çıkış Yap
        </a>
      </div>
    </div>
  )
}
