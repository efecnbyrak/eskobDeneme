import { prisma } from './db'
import { KATEGORILER } from './constants'

let seeded = false

export async function kategorileriGarantile() {
  if (seeded) return
  const mevcut = await prisma.kategori.count()
  if (mevcut >= KATEGORILER.length) {
    seeded = true
    return
  }
  for (const [sira, k] of KATEGORILER.entries()) {
    await prisma.kategori.upsert({
      where: { slug: k.slug },
      update: {},
      create: { ad: k.ad, slug: k.slug, ikon: k.ikon, renk: k.renk, sira },
    })
  }
  seeded = true
}
