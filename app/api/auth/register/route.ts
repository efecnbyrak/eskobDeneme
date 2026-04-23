import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { benzersizSlug } from '@/lib/slug'
import { kategorileriGarantile } from '@/lib/bootstrap'
import { KayitSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = KayitSchema.safeParse(body)

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Geçersiz veri.'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const veri = parsed.data
    const email = veri.email.toLowerCase().trim()
    const telefon = veri.telefon?.replace(/\s+/g, '') || undefined

    const mevcut = await prisma.kullanici.findUnique({ where: { email } })
    if (mevcut) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 400 })
    }

    const sifreHash = await bcrypt.hash(veri.sifre, 12)

    if (veri.tip === 'USER') {
      const kullanici = await prisma.kullanici.create({
        data: {
          ad: veri.ad.trim(),
          soyad: veri.soyad.trim(),
          email,
          telefon,
          sifreHash,
          rol: 'USER',
          sehir: veri.sehir,
          ilce: veri.ilce.trim(),
          ilgiAlanlari: veri.ilgiAlanlari,
        },
      })
      return NextResponse.json({ id: kullanici.id, rol: kullanici.rol }, { status: 201 })
    }

    await kategorileriGarantile()
    const kategori = await prisma.kategori.findUnique({ where: { slug: veri.kategoriSlug } })
    if (!kategori) {
      return NextResponse.json({ error: 'Seçilen kategori geçerli değil.' }, { status: 400 })
    }

    const benzerler = await prisma.esnaf.findMany({
      where: { slug: { startsWith: veri.isletmeAdi.toLowerCase().slice(0, 20) } },
      select: { slug: true },
    })
    const slug = benzersizSlug(veri.isletmeAdi, benzerler.map((b) => b.slug))

    const kullanici = await prisma.kullanici.create({
      data: {
        ad: veri.ad.trim(),
        soyad: veri.soyad.trim(),
        email,
        telefon,
        sifreHash,
        rol: 'BUSINESS',
        esnaf: {
          create: {
            slug,
            isletmeAdi: veri.isletmeAdi.trim(),
            kategoriId: kategori.id,
            sehir: veri.sehir,
            ilce: veri.ilce.trim(),
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
