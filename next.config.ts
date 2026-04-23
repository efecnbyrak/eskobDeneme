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
      { source: '/user', destination: '/musteri/genel', permanent: true },
      { source: '/user/favoriler', destination: '/musteri/genel/favorilerim', permanent: true },
      { source: '/user/randevular', destination: '/musteri/genel/randevularim', permanent: true },
      { source: '/user/yorumlar', destination: '/musteri/genel/yorumlarim', permanent: true },
      { source: '/user/profil', destination: '/musteri/genel/profil', permanent: true },
      { source: '/user/ayarlar', destination: '/musteri/genel/ayarlar', permanent: true },
    ]
  },
}

export default nextConfig
