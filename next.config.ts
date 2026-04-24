import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/user', destination: '/hesabim', permanent: false },
      { source: '/user/:path*', destination: '/hesabim', permanent: false },
      { source: '/musteri/genel', destination: '/hesabim', permanent: false },
      { source: '/musteri/genel/:path*', destination: '/hesabim', permanent: false },
    ]
  },
}

export default nextConfig
