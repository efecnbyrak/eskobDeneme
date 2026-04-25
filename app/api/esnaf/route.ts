import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { benzersizSlug } from '@/lib/slug'
import { temizMetinOpsiyonel } from '@/lib/sanitize'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sehir = searchParams.get('sehir')
    const kategori = searchParams.get('kategori')
    const arama = searchParams.get('arama')
    const sayfa = Math.max(1, parseInt(searchParams.get('sayfa') || '1') || 1)
    const limit = 12

    const where = {
      aktif: true,
      onaylı: true,
      ...(sehir && { sehir }),
      ...(kategori && { kategori: { slug: kategori } }),
      ...(arama && {
        OR: [
          { isletmeAdi: { contains: arama, mode: 'insensitive' as const } },
          { aciklama: { contains: arama, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [esnaflar, toplam] = await prisma.$transaction([
      prisma.esnaf.findMany({
        where,
        select: {
          id: true,
          slug: true,
          isletmeAdi: true,
          aciklama: true,
          kapakFoto: true,
          logoUrl: true,
          sehir: true,
          ilce: true,
          aktif: true,
          onaylı: true,
          olusturmaT: true,
          fotograflar: true,
          kategori: {
            select: { id: true, ad: true, slug: true, ikon: true, renk: true, sira: true },
          },
          hizmetler: {
            where: { aktif: true },
            take: 3,
            orderBy: { sira: 'asc' },
            select: { id: true, ad: true, fiyat: true, sure: true, aktif: true, sira: true, esnafId: true, aciklama: true, fotoUrl: true },
          },
        },
        orderBy: { olusturmaT: 'desc' },
        take: limit,
        skip: (sayfa - 1) * limit,
      }),
      prisma.esnaf.count({ where }),
    ])

    // Tek aggregate sorgu — tüm sayfa için onaylı yorum istatistikleri
    const esnafIds = esnaflar.map((e) => e.id)
    const puanlar = esnafIds.length
      ? await prisma.yorum.groupBy({
          by: ['esnafId'],
          where: { onaylı: true, esnafId: { in: esnafIds } },
          _avg: { puan: true },
          _count: { _all: true },
          orderBy: { esnafId: 'asc' },
        })
      : []

    const puanMap = new Map<number, { ortalama: number; adet: number }>(
      puanlar.map((p) => [
        p.esnafId,
        { ortalama: p._avg?.puan ?? 0, adet: p._count?._all ?? 0 },
      ])
    )

    // UI ortalamaPuan() helper'ı yorumlar arrayinden hesap yapıyor — geriye dönük
    // uyumluluk için ortalama puandan stub array enjekte et
    const zenginlestirilmis = esnaflar.map((e) => {
      const p = puanMap.get(e.id)
      const ortalama = p?.ortalama ?? 0
      const adet = p?.adet ?? 0
      return {
        ...e,
        yorumlar: adet > 0
          ? Array.from({ length: adet }, () => ({ puan: Math.round(ortalama) }))
          : [],
      }
    })

    return NextResponse.json({ esnaflar: zenginlestirilmis, toplam, sayfa, limit })
  } catch (err) {
    logger.error('esnaf.GET', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const oturum = await auth()
    if (!oturum?.user?.email) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }
    if (oturum.user.rol !== 'BUSINESS' && oturum.user.rol !== 'ADMIN' && oturum.user.rol !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Sadece işletme hesapları esnaf oluşturabilir' },
        { status: 403 }
      )
    }

    const kullanici = await prisma.kullanici.findUnique({ where: { email: oturum.user.email } })
    if (!kullanici) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body.isletmeAdi !== 'string' || typeof body.kategoriSlug !== 'string') {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
    }

    const dbKat = await prisma.kategori.findUnique({ where: { slug: body.kategoriSlug } })
    if (!dbKat) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 400 })
    }

    const mevcutSluglar = (
      await prisma.esnaf.findMany({ select: { slug: true } })
    ).map((e) => e.slug)
    const slug = benzersizSlug(body.isletmeAdi, mevcutSluglar)

    const esnaf = await prisma.esnaf.create({
      data: {
        slug,
        isletmeAdi: body.isletmeAdi.toString().trim().slice(0, 120),
        kategoriId: dbKat.id,
        sehir: (body.sehir || '').toString().trim(),
        ilce: (body.ilce || '').toString().trim(),
        adres: temizMetinOpsiyonel(body.adres, 300),
        telefon: temizMetinOpsiyonel(body.telefon, 30),
        whatsapp: temizMetinOpsiyonel(body.whatsapp, 30),
        instagram: temizMetinOpsiyonel(body.instagram, 60),
        logoUrl: temizMetinOpsiyonel(body.logoUrl, 500),
        kapakFoto: temizMetinOpsiyonel(body.kapakFoto, 500),
        aciklama: temizMetinOpsiyonel(body.aciklama, 500),
        calismaS: body.calismaS ?? undefined,
        kullaniciId: kullanici.id,
        onaylı: true,
      },
    })

    return NextResponse.json(esnaf, { status: 201 })
  } catch (err) {
    logger.error('esnaf.POST', { err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
