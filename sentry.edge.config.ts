import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Edge runtime'da tracing kapalı (performans etkisini minimize et)
  tracesSampleRate: 0,

  enabled: process.env.NODE_ENV === 'production',
})
