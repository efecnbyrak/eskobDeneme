import Link from 'next/link'

export default function EsnafBulunamadi() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '48px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 56 }}>🔍</div>
      <h1
        className="font-display"
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.01em',
        }}
      >
        İşletme bulunamadı
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
        Aradığınız işletme kaldırılmış veya adresi değişmiş olabilir.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/ara"
          style={{
            height: 48,
            padding: '0 24px',
            fontSize: 15,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--color-primary, #F27A1A)',
            color: 'white',
            borderRadius: 12,
            textDecoration: 'none',
          }}
        >
          İşletme ara
        </Link>
        <Link
          href="/"
          style={{
            height: 48,
            padding: '0 24px',
            fontSize: 15,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            border: '1.5px solid var(--color-border)',
            borderRadius: 12,
            textDecoration: 'none',
            color: 'var(--color-text)',
          }}
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  )
}
