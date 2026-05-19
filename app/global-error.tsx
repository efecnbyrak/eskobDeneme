'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 32,
          fontFamily: 'system-ui, sans-serif',
          background: '#FAFAFA',
          color: '#111',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 56 }}>🛠️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Sistem hatası</h1>
        <p style={{ color: '#555', maxWidth: 460 }}>
          Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
        {error.digest && (
          <code style={{ fontSize: 12, color: '#888' }}>{error.digest}</code>
        )}
        <button
          onClick={() => reset()}
          style={{
            marginTop: 8,
            height: 44,
            padding: '0 24px',
            background: '#F27A1A',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Yenile
        </button>
      </body>
    </html>
  )
}
