import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

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
  const kullanici = await prisma.kullanici.findUnique({
    where: { email: 'esnaftest@gmail.com' },
    include: { esnaf: true },
  })

  if (!kullanici) {
    console.log('❌ Hesap bulunamadı: esnaftest@gmail.com')
    console.log('   Önce create-test-isletme.ts scriptini çalıştırın.')
    return
  }

  console.log('📋 Mevcut durum:')
  console.log('   ID    :', kullanici.id)
  console.log('   E-posta:', kullanici.email)
  console.log('   Rol   :', kullanici.rol)
  console.log('   Esnaf :', kullanici.esnaf ? kullanici.esnaf.isletmeAdi : '(yok)')

  if (kullanici.rol === 'BUSINESS') {
    console.log('\n✅ Rol zaten BUSINESS — düzeltme gerekmez.')
  } else {
    await prisma.kullanici.update({
      where: { email: 'esnaftest@gmail.com' },
      data: { rol: 'BUSINESS' },
    })
    console.log('\n✅ Rol güncellendi: USER →', 'BUSINESS')
  }

  if (!kullanici.esnaf) {
    const kategori = await prisma.kategori.findFirst()
    if (!kategori) {
      console.log('\n⚠️  Esnaf kaydı yok ama kategori de bulunamadı. Seed verilerini yükleyin.')
      return
    }
    await prisma.esnaf.create({
      data: {
        slug: 'test-kuafor-istanbul',
        isletmeAdi: 'Test Kuaför',
        kategoriId: kategori.id,
        sehir: 'İstanbul',
        ilce: 'Kadıköy',
        kullaniciId: kullanici.id,
        aktif: true,
        onaylı: true,
      },
    })
    console.log('✅ Esnaf kaydı oluşturuldu: Test Kuaför')
  }

  console.log('\n🎉 Hazır! /isletme/giris → esnaftest@gmail.com / Eskob2024!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
