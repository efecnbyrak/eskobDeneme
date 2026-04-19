import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { slugOlustur, benzersizSlug } from '@/lib/slug'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sehir = searchParams.get('sehir')
    const kategori = searchParams.get('kategori')
    const arama = searchParams.get('arama')
    const sayfa = parseInt(searchParams.get('sayfa') || '1')
    const limit = 12

    const esnaflar = await prisma.esnaf.findMany({
      where: {
        aktif: true,
        onaylı: true,
        ...(sehir && { sehir }),
        ...(kategori && { kategori: { slug: kategori } }),
        ...(arama && {
          OR: [
            { isletmeAdi: { contains: arama, mode: 'insensitive' } },
            { aciklama: { contains: arama, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        kategori: true,
        yorumlar: { select: { puan: true } },
        hizmetler: { where: { aktif: true }, take: 3 },
      },
      orderBy: { olusturmaT: 'desc' },
      take: limit,
      skip: (sayfa - 1) * limit,
    })

    const toplam = await prisma.esnaf.count({
      where: {
        aktif: true,
        onaylı: true,
        ...(sehir && { sehir }),
        ...(kategori && { kategori: { slug: kategori } }),
      },
    })

    return NextResponse.json({ esnaflar, toplam, sayfa, limit })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const kullanici = await prisma.kullanici.findUnique({ where: { email: oturum.user.email } })
    if (!kullanici) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

    const body = await req.json()

    const dbKat = await prisma.kategori.findUnique({ where: { slug: body.kategoriSlug } })
    if (!dbKat) return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 400 })

    const mevcutSluglar = (await prisma.esnaf.findMany({ select: { slug: true } })).map((e: { slug: string }) => e.slug)
    const slug = benzersizSlug(body.isletmeAdi, mevcutSluglar)

    const esnaf = await prisma.esnaf.create({
      data: {
        slug,
        isletmeAdi: body.isletmeAdi,
        kategoriId: dbKat.id,
        sehir: body.sehir || '',
        ilce: body.ilce || '',
        adres: body.adres,
        telefon: body.telefon,
        whatsapp: body.whatsapp,
        instagram: body.instagram,
        logoUrl: body.logoUrl,
        kapakFoto: body.kapakFoto,
        calismaS: body.calismaS,
        kullaniciId: kullanici.id,
        onaylı: true,
      },
    })

    return NextResponse.json(esnaf, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
