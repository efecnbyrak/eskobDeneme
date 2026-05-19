import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js App Router inline script'leri ve Iyzico ödeme form script'leri için unsafe-inline gerekli
      "script-src 'self' 'unsafe-inline' https://*.iyzipay.com",
      "style-src 'self' 'unsafe-inline'",
      [
        "img-src 'self' data: blob:",
        'https://*.public.blob.vercel-storage.com',
        'https://*.blob.vercel-storage.com',
        'https://res.cloudinary.com',
        'https://*.googleusercontent.com',
        'https://avatars.githubusercontent.com',
        'https://images.unsplash.com',
        'https://cdn.jsdelivr.net',
      ].join(' '),
      "font-src 'self' data:",
      "connect-src 'self' https://*.iyzipay.com",
      "frame-src https://*.iyzipay.com",
      "frame-ancestors 'self'",
      "form-action 'self' https://*.iyzipay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

// Mobil/native istemcilere ortak API erişimi için CORS
// Production'da env var set edilmezse boş string → cross-origin istekler reddedilir (güvenli)
// Development'da '*' → local Expo testi çalışmaya devam eder
const corsOrigin =
  process.env.MOBILE_APP_ORIGIN ??
  process.env.SITE_URL ??
  (process.env.NODE_ENV === 'production' ? '' : '*')

const corsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: corsOrigin },
  { key: 'Access-Control-Allow-Credentials', value: 'true' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'Content-Type, Authorization, X-Client, Idempotency-Key, X-Requested-With',
  },
  { key: 'Vary', value: 'Origin' },
]

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'iyzipay'],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/api/:path*',
        headers: corsHeaders,
      },
    ]
  },
  async redirects() {
    return [
      { source: '/user', destination: '/hesabim', permanent: false },
      { source: '/user/:path*', destination: '/hesabim', permanent: false },
      { source: '/musteri/genel', destination: '/hesabim', permanent: false },
      { source: '/musteri/genel/:path*', destination: '/hesabim', permanent: false },
      { source: '/dashboard', destination: '/isletme/panel', permanent: false },
      { source: '/dashboard/:path*', destination: '/isletme/panel/:path*', permanent: false },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry organizasyon ve proje bilgileri — .env.example'daki değişkenlerden okunur
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Build output'unu sessiz tut
  silent: !process.env.CI,

  // Source map'leri upload sonrası sil (production güvenliği)
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Client-side bundle boyutunu optimize et
  widenClientFileUpload: true,

  webpack: {
    // Sentry debug loglarını tree-shake ile kaldır (disableLogger yerine)
    treeshake: {
      removeDebugLogging: true,
    },
    // Vercel otomatik monitor — cron monitor'ü manuel yönetiyoruz
    automaticVercelMonitors: false,
  },
})
