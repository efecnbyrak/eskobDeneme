import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

function sanitize(url: string) {
  try {
    const p = new URL(url)
    p.searchParams.delete('channel_binding')
    return p.toString()
  } catch {
    return url
  }
}

const raw = process.env.DATABASE_URL
if (!raw) throw new Error('DATABASE_URL tanımlı değil')
const adapter = new PrismaPg({ connectionString: sanitize(raw), max: 1 })
const prisma = new PrismaClient({ adapter })

async function main() {
  const mevcut = await prisma.kullanici.findUnique({ where: { email: 'esnaftest@gmail.com' } })
  if (mevcut) {
    console.log('Hesap zaten mevcut:', mevcut.email, '| ID:', mevcut.id)
    return
  }

  const kategori = await prisma.kategori.findFirst()
  if (!kategori) {
    console.error('Hiç kategori yok! Önce seed verilerini yükleyin.')
    return
  }

  const hash = await bcrypt.hash('Eskob2024!', 12)

  const user = await prisma.kullanici.create({
    data: {
      email: 'esnaftest@gmail.com',
      sifreHash: hash,
      ad: 'Esnaf',
      soyad: 'Test',
      kullaniciAdi: 'esnaftest',
      rol: 'BUSINESS',
      emailOnay: true,
      esnaf: {
        create: {
          slug: 'test-kuafor-istanbul',
          isletmeAdi: 'Test Kuaför',
          kategoriId: kategori.id,
          sehir: 'İstanbul',
          ilce: 'Kadıköy',
          aktif: true,
          onaylı: true,
        },
      },
    },
  })

  console.log('✅ Test işletme hesabı oluşturuldu!')
  console.log('   E-posta : esnaftest@gmail.com')
  console.log('   Şifre   : Eskob2024!')
  console.log('   Giriş   : /isletme/giris')
  console.log('   User ID :', user.id)
}

main().catch(console.error).finally(() => prisma.$disconnect())
