import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { KATEGORILER } from '../lib/constants'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Kategoriler oluşturuluyor...')
  for (const [index, k] of KATEGORILER.entries()) {
    await prisma.kategori.upsert({
      where: { slug: k.slug },
      update: {},
      create: { ad: k.ad, slug: k.slug, ikon: k.ikon, renk: k.renk, sira: index },
    })
  }
  console.log('✅ Seed tamamlandı!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
