import { NextRequest } from 'next/server'
import { mobilAuth } from '@/lib/auth'
import { getRecentlyViewedService, trackRecentlyViewedService } from '@/lib/services/recently-viewed.service'
import { basari, hata } from '@/lib/api'
import { rateLimit, istemciKimligi } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const ip = istemciKimligi(req)
  const rl = await rateLimit(`v1:gezilen:${ip}`, 60, 60)
  if (!rl.basarili) {
    return hata('Çok fazla istek', 429)
  }

  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const data = await getRecentlyViewedService(oturum.user.id, { limit })
    return basari(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Sunucu hatası'
    return hata(msg, 500)
  }
}

export async function POST(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Unauthorized', 401)

  try {
    const { esnafId } = await req.json()
    if (!esnafId) return hata('esnafId required', 400)

    const result = await trackRecentlyViewedService(oturum.user.id, esnafId)
    if (!result.success) return hata((result as { success: false; error: string }).error, 400)

    return basari({ ok: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Sunucu hatası'
    return hata(msg, 500)
  }
}
