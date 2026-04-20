import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { benzersizSlug } from '@/lib/slug'
import { kategorileriGarantile } from '@/lib/bootstrap'

const BaseSchema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter olmalı.'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter olmalı.'),
  email: z.string().email('Geçerli bir e-posta girin.'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı.'),
  telefon: z.string().optional(),
})

const UserSchema = BaseSchema.extend({
  tip: z.literal('USER'),
})

const BusinessSchema = BaseSchema.extend({
  tip: z.literal('BUSINESS'),
  isletmeAdi: z.string().min(2, 'İşletme adı gerekli.'),
  kategoriSlug: z.string().min(1, 'Kategori seçin.'),
  sehir: z.string().min(1, 'Şehir seçin.'),
  ilce: z.string().min(1, 'İlçe girin.'),
})

const RegisterSchema = z.discriminatedUnion('tip', [UserSchema, BusinessSchema])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Geçersiz veri.'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const veri = parsed.data
    const email = veri.email.toLowerCase().trim()

    const mevcut = await prisma.kullanici.findUnique({ where: { email } })
    if (mevcut) {
      return NextResponse.json(
        { error: 'Bu e-posta zaten kayıtlı.' },
        { status: 400 }
      )
    }

    const sifreHash = await bcrypt.hash(veri.sifre, 12)

    if (veri.tip === 'USER') {
      const kullanici = await prisma.kullanici.create({
        data: {
          ad: veri.ad,
          soyad: veri.soyad,
          email,
          telefon: veri.telefon,
          sifreHash,
          rol: 'USER',
        },
      })
      return NextResponse.json({ id: kullanici.id, rol: kullanici.rol }, { status: 201 })
    }

    await kategorileriGarantile()
    const kategori = await prisma.kategori.findUnique({ where: { slug: veri.kategoriSlug } })
    if (!kategori) {
      return NextResponse.json(
        { error: 'Seçilen kategori geçerli değil.' },
        { status: 400 }
      )
    }

    const benzerler = await prisma.esnaf.findMany({
      where: { slug: { startsWith: veri.isletmeAdi.toLowerCase().slice(0, 20) } },
      select: { slug: true },
    })
    const slug = benzersizSlug(veri.isletmeAdi, benzerler.map((b) => b.slug))

    const kullanici = await prisma.kullanici.create({
      data: {
        ad: veri.ad,
        soyad: veri.soyad,
        email,
        telefon: veri.telefon,
        sifreHash,
        rol: 'BUSINESS',
        esnaf: {
          create: {
            slug,
            isletmeAdi: veri.isletmeAdi,
            kategoriId: kategori.id,
            sehir: veri.sehir,
            ilce: veri.ilce,
          },
        },
      },
    })

    return NextResponse.json({ id: kullanici.id, rol: kullanici.rol }, { status: 201 })
  } catch (err) {
    console.error('register error', err)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
