import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const revalidate = 3600

function siteUrl(): string {
  return (
    process.env.SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const simdi = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: simdi, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/ara`, lastModified: simdi, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/iletisim`, lastModified: simdi, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/gizlilik`, lastModified: simdi, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/kullanim`, lastModified: simdi, changeFrequency: 'yearly', priority: 0.2 },
  ]

  try {
    const [esnaflar, kategoriler] = await Promise.all([
      prisma.esnaf.findMany({
        where: { aktif: true, onaylı: true },
        select: { slug: true, sehir: true, guncelleT: true },
        take: 5000,
      }),
      prisma.kategori.findMany({ select: { slug: true } }),
    ])

    const esnafEntries: MetadataRoute.Sitemap = esnaflar.map((e) => ({
      url: `${base}/${encodeURIComponent(e.sehir.toLowerCase())}/${e.slug}`,
      lastModified: e.guncelleT,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const kategoriEntries: MetadataRoute.Sitemap = kategoriler.map((k) => ({
      url: `${base}/ara?kategori=${encodeURIComponent(k.slug)}`,
      lastModified: simdi,
      changeFrequency: 'daily',
      priority: 0.6,
    }))

    return [...staticEntries, ...kategoriEntries, ...esnafEntries]
  } catch {
    return staticEntries
  }
}
