import { prisma } from '@/lib/db'

export async function getCampaignsService(options: { limit?: number; page?: number } = {}) {
  const limit = options.limit || 8
  const page = options.page || 1
  
  try {
    return await prisma.hizmet.findMany({
      where: {
        aktif: true,
        indirimYuzde: { gt: 0 },
        indirimBitis: { gte: new Date() }
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        esnaf: {
          select: { id: true, isletmeAdi: true, slug: true, sehir: true, ilce: true }
        }
      },
      orderBy: [
        { oncelik: 'desc' },
        { indirimYuzde: 'desc' }
      ]
    })
  } catch (error: any) {
    console.error(`[CAMPAIGN_SERVICE_ERROR_2001] getCampaignsService failed: ${error.message}`)
    return []
  }
}
