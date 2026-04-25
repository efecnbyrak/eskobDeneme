import { prisma } from '@/lib/db'

export async function getRecentlyViewedService(userId: number | string, options: { limit?: number } = {}) {
  const limit = options.limit || 10
  const uId = typeof userId === 'string' ? parseInt(userId, 10) : userId
  
  if (isNaN(uId)) return []

  try {
    const recentlyViewed = await prisma.gezilenEsnaf.findMany({
      where: { kullaniciId: uId },
      orderBy: { sonGorulmeT: 'desc' },
      take: limit,
      include: {
        esnaf: {
          include: {
            kategori: true,
            yorumlar: { select: { puan: true } },
            hizmetler: { where: { aktif: true }, take: 2 }
          }
        }
      }
    })
    return recentlyViewed.map(rv => rv.esnaf)
  } catch (error: any) {
    console.error(`[RECENT_VIEW_SERVICE_ERROR_3001] getRecentlyViewedService failed: ${error.message}`)
    return []
  }
}

export async function trackRecentlyViewedService(userId: number | string, esnafId: number | string) {
  const uId = typeof userId === 'string' ? parseInt(userId, 10) : userId
  const eId = typeof esnafId === 'string' ? parseInt(esnafId, 10) : esnafId

  if (isNaN(uId) || isNaN(eId)) return { success: false, error: 'Invalid IDs' }

  try {
    await prisma.gezilenEsnaf.upsert({
      where: {
        kullaniciId_esnafId: {
          kullaniciId: uId,
          esnafId: eId
        }
      },
      update: {
        sonGorulmeT: new Date()
      },
      create: {
        kullaniciId: uId,
        esnafId: eId
      }
    })
    return { success: true }
  } catch (error: any) {
    console.error(`[RECENT_VIEW_SERVICE_ERROR_3002] trackRecentlyViewedService failed: ${error.message}`)
    return { success: false, error: error.message }
  }
}
