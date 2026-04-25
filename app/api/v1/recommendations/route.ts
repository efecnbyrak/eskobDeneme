import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10', 10)

  try {
    let categoryIds: number[] = []

    // If logged in, get categories of recently viewed items
    if (session?.user?.id) {
      const userId = parseInt(session.user.id, 10)
      const recentlyViewed = await prisma.gezilenEsnaf.findMany({
        where: { kullaniciId: userId },
        include: { esnaf: { select: { kategoriId: true } } },
        orderBy: { sonGorulmeT: 'desc' },
        take: 5
      })
      categoryIds = [...new Set(recentlyViewed.map(rv => rv.esnaf.kategoriId))]
    }

    // Build query: if we have history, prioritize those categories
    const whereClause: any = { aktif: true, onaylı: true }
    if (categoryIds.length > 0) {
      whereClause.kategoriId = { in: categoryIds }
    }

    let recommendations = await prisma.esnaf.findMany({
      where: whereClause,
      include: {
        kategori: true,
        yorumlar: { select: { puan: true } },
        hizmetler: { where: { aktif: true }, take: 2 }
      },
      take: limit,
      // Randomly order or by newest if random is not supported directly in Prisma easily.
      orderBy: { olusturmaT: 'desc' }
    })

    // Fallback if no recommendations found from categories
    if (recommendations.length === 0 && categoryIds.length > 0) {
      recommendations = await prisma.esnaf.findMany({
        where: { aktif: true, onaylı: true },
        include: {
          kategori: true,
          yorumlar: { select: { puan: true } },
          hizmetler: { where: { aktif: true }, take: 2 }
        },
        take: limit,
        orderBy: { olusturmaT: 'desc' }
      })
    }

    return NextResponse.json({ success: true, data: recommendations })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
