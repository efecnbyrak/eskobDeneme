import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { KATEGORILER } from '../lib/constants'
import bcrypt from 'bcryptjs'

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

  console.log('Süper admin oluşturuluyor...')
  const sifreHash = await bcrypt.hash('phyberk123', 12)
  await prisma.kullanici.upsert({
    where: { email: 'phyberk123@gmail.com' },
    update: { rol: 'SUPER_ADMIN', sifreHash },
    create: {
      email: 'phyberk123@gmail.com',
      sifreHash,
      ad: 'Phyberk',
      soyad: 'Admin',
      rol: 'SUPER_ADMIN',
    },
  })

  console.log('Test kullanıcısı oluşturuluyor...')
  const testSifreHash = await bcrypt.hash('Test123!', 12)
  await prisma.kullanici.upsert({
    where: { email: 'test@eskob.com' },
    update: { sifreHash: testSifreHash },
    create: {
      email: 'test@eskob.com',
      sifreHash: testSifreHash,
      ad: 'Test',
      soyad: 'Kullanici',
      rol: 'USER',
      kullaniciAdi: 'testkullanici',
    },
  })

  console.log('✅ Seed tamamlandı!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
