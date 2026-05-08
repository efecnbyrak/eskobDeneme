import { NextRequest } from 'next/server'
import { mobilAuth } from '@/lib/auth'
import { getRecommendationsService } from '@/lib/services/recommendation.service'
import { basari, hata } from '@/lib/api'

export async function GET(req: NextRequest) {
  const oturum = await mobilAuth(req)
  const limit = parseInt(new URL(req.url).searchParams.get('limit') || '10', 10)

  try {
    const data = await getRecommendationsService(oturum?.user?.id, { limit })
    return basari(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Sunucu hatası'
    return hata(msg, 500)
  }
}
