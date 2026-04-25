import { prisma } from '@/lib/db'

export async function getRecommendationsService(userId?: number | string, options: { limit?: number } = {}) {
  const limit = options.limit || 8

  try {
    let categoryIds: number[] = []

    if (userId) {
      const uId = typeof userId === 'string' ? parseInt(userId, 10) : userId
      if (!isNaN(uId)) {
        const recentlyViewed = await prisma.gezilenEsnaf.findMany({
          where: { kullaniciId: uId },
          include: { esnaf: { select: { kategoriId: true } } },
          orderBy: { sonGorulmeT: 'desc' },
          take: 5
        })
        categoryIds = [...new Set(recentlyViewed.map(rv => rv.esnaf.kategoriId))]
      }
    }

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
      orderBy: { olusturmaT: 'desc' }
    })

    if (recommendations.length < limit) {
      // Fallback: fill with top rated/latest businesses to ensure the section isn't empty
      const existingIds = recommendations.map(r => r.id)
      const fallback = await prisma.esnaf.findMany({
        where: { aktif: true, onaylı: true, id: { notIn: existingIds } },
        include: {
          kategori: true,
          yorumlar: { select: { puan: true } },
          hizmetler: { where: { aktif: true }, take: 2 }
        },
        take: limit - recommendations.length,
        orderBy: { olusturmaT: 'desc' }
      })
      recommendations = [...recommendations, ...fallback]
    }

    return recommendations
  } catch (error: any) {
    console.error(`[RECOMMENDATION_SERVICE_ERROR_4001] getRecommendationsService failed: ${error.message}`)
    return []
  }
}

export async function getTopEsnafService(options: { limit?: number } = {}) {
  const limit = options.limit || 8
  try {
    return await prisma.esnaf.findMany({
      where: { aktif: true, onaylı: true },
      include: {
        kategori: true,
        yorumlar: { select: { puan: true } },
        hizmetler: { where: { aktif: true }, take: 2 },
      },
      orderBy: { olusturmaT: 'desc' },
      take: limit,
    })
  } catch (error: any) {
    console.error(`[TOP_ESNAF_SERVICE_ERROR_4002] getTopEsnafService failed: ${error.message}`)
    return []
  }
}
