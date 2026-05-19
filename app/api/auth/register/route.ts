import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { benzersizSlug } from '@/lib/slug'
import { kategorileriGarantile } from '@/lib/bootstrap'
import { KayitSchema } from '@/lib/validations'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { basari } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: IP başına saatte 10 kayıt denemesi
    const ip = istemciKimligi(req)
    const limit = await rateLimit(`register:${ip}`, 10, 3600)
    if (!limit.basarili) {
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
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
      let kullaniciAdi = veri.kullaniciAdi?.trim() || null
      if (kullaniciAdi) {
        const mevcutAd = await prisma.kullanici.findUnique({ where: { kullaniciAdi } })
        if (mevcutAd) {
          return NextResponse.json({ error: 'Bu kullanıcı adı zaten alınmış.' }, { status: 400 })
        }
      } else {
        // Otomatik kullanıcı adı üret: ad+soyad lowercase + random suffix
        const base = `${veri.ad}${veri.soyad}`.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16)
        let candidate = base
        let mevcut = await prisma.kullanici.findUnique({ where: { kullaniciAdi: candidate } })
        let deneme = 0
        while (mevcut && deneme < 10) {
          candidate = `${base}${Math.floor(100 + Math.random() * 900)}`
          mevcut = await prisma.kullanici.findUnique({ where: { kullaniciAdi: candidate } })
          deneme++
        }
        kullaniciAdi = candidate
      }
      const kullanici = await prisma.kullanici.create({
        data: {
          ad: veri.ad.trim(),
          soyad: veri.soyad.trim(),
          email,
          kullaniciAdi,
          telefon,
          sifreHash,
          rol: 'USER',
          sehir: veri.sehir ?? '',
          ilce: (veri.ilce ?? '').trim(),
          ilgiAlanlari: veri.ilgiAlanlari ?? [],
        },
      })
      return basari({ id: kullanici.id, rol: kullanici.rol }, 201)
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

    return basari({ id: kullanici.id, rol: kullanici.rol }, 201)
  } catch (err) {
    logger.error('register', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
