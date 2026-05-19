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

  // Admin kullanıcısı — credentials env var'lardan okunur, kod içine gömülmez
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminSifre = process.env.SEED_ADMIN_SIFRE
  if (!adminEmail || !adminSifre) {
    throw new Error(
      'SEED_ADMIN_EMAIL ve SEED_ADMIN_SIFRE env değişkenleri tanımlı değil. ' +
      '.env.local dosyanıza ekleyin ve tekrar çalıştırın.'
    )
  }

  console.log('Süper admin oluşturuluyor...')
  const sifreHash = await bcrypt.hash(adminSifre, 12)
  await prisma.kullanici.upsert({
    where: { email: adminEmail },
    update: { rol: 'SUPER_ADMIN', sifreHash },
    create: {
      email: adminEmail,
      sifreHash,
      ad: 'Admin',
      soyad: 'Kullanici',
      rol: 'SUPER_ADMIN',
    },
  })

  // Test kullanıcısı — sadece non-production ortamda oluştur
  const testEmail = process.env.SEED_TEST_EMAIL
  const testSifre = process.env.SEED_TEST_SIFRE
  if (testEmail && testSifre) {
    console.log('Test kullanıcısı oluşturuluyor...')
    const testSifreHash = await bcrypt.hash(testSifre, 12)
    await prisma.kullanici.upsert({
      where: { email: testEmail },
      update: { sifreHash: testSifreHash },
      create: {
        email: testEmail,
        sifreHash: testSifreHash,
        ad: 'Test',
        soyad: 'Kullanici',
        rol: 'USER',
        kullaniciAdi: 'testkullanici',
      },
    })
  } else {
    console.log('SEED_TEST_EMAIL / SEED_TEST_SIFRE tanımlı değil, test kullanıcısı atlandı.')
  }

  console.log('✅ Seed tamamlandı!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
