import type { MetadataRoute } from 'next'

function siteUrl(): string {
  return (
    process.env.SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/panel/',
          '/isletme/panel/',
          '/phyberk/',
          '/hesabim/',
          '/giris',
          '/kayit',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
