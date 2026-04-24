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
      { source: '/user', destination: '/musteri/genel', permanent: false },
      { source: '/user/favoriler', destination: '/musteri/genel/favorilerim', permanent: false },
      { source: '/user/randevular', destination: '/musteri/genel/randevularim', permanent: false },
      { source: '/user/yorumlar', destination: '/musteri/genel/yorumlarim', permanent: false },
      { source: '/user/profil', destination: '/musteri/genel/profil', permanent: false },
      { source: '/user/ayarlar', destination: '/musteri/genel/ayarlar', permanent: false },
    ]
  },
}

export default nextConfig
