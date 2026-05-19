import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Server-side örnekleme — production'da %10
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Yalnızca production'da aktif
  enabled: process.env.NODE_ENV === 'production',
})
