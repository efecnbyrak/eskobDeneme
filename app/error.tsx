'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '48px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 56 }}>⚠️</div>
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 800,
          color: 'var(--color-text)',
          letterSpacing: '-0.01em',
        }}
      >
        Bir şeyler ters gitti
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
        İsteğinizi işlerken bir hata oluştu. Tekrar denerseniz büyük olasılıkla
        çözülür. Sorun devam ederse lütfen bize bildirin.
      </p>
      {error.digest && (
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          Hata kodu: <code>{error.digest}</code>
        </p>
      )}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            height: 48,
            padding: '0 24px',
            fontSize: 15,
            fontWeight: 700,
            background: 'var(--color-primary, #F27A1A)',
            color: 'white',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          style={{
            height: 48,
            padding: '0 24px',
            fontSize: 15,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 12,
            border: '1.5px solid var(--color-border)',
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
