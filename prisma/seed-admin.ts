import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'phyberk123@gmail.com'
  const mevcut = await prisma.kullanici.findUnique({ where: { email } })

  if (mevcut) {
    await prisma.kullanici.update({
      where: { email },
      data: { rol: 'SUPER_ADMIN' },
    })
    console.log('Admin kullanıcı zaten var, rol SUPER_ADMIN yapıldı.')
    return
  }

  const sifreHash = await bcrypt.hash('phyberk123', 12)
  await prisma.kullanici.create({
    data: {
      email,
      ad: 'Phyberk',
      soyad: 'Admin',
      kullaniciAdi: 'phyberk',
      sifreHash,
      rol: 'SUPER_ADMIN',
    },
  })
  console.log('Admin kullanıcı oluşturuldu: phyberk123@gmail.com / phyberk123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
