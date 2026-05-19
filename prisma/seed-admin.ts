import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const sifre = process.env.SEED_ADMIN_SIFRE

  if (!email || !sifre) {
    throw new Error(
      'SEED_ADMIN_EMAIL ve SEED_ADMIN_SIFRE env değişkenleri zorunludur. ' +
      '.env.local dosyanıza ekleyin ve tekrar çalıştırın.'
    )
  }

  const mevcut = await prisma.kullanici.findUnique({ where: { email } })

  if (mevcut) {
    await prisma.kullanici.update({
      where: { email },
      data: { rol: 'SUPER_ADMIN' },
    })
    console.log(`Admin kullanıcı zaten var (${email}), rol SUPER_ADMIN yapıldı.`)
    return
  }

  const sifreHash = await bcrypt.hash(sifre, 12)
  await prisma.kullanici.create({
    data: {
      email,
      ad: 'Admin',
      soyad: 'Kullanici',
      kullaniciAdi: 'admin',
      sifreHash,
      rol: 'SUPER_ADMIN',
    },
  })
  console.log(`Admin kullanıcı oluşturuldu: ${email}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
