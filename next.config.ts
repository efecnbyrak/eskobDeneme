import type { NextConfig } from 'next'

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
]

// Mobil/native istemcilere ortak API erişimi için CORS
const corsOrigin =
  process.env.MOBILE_APP_ORIGIN ?? process.env.SITE_URL ?? '*'

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
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
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

export default nextConfig
