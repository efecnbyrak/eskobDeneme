import { Redis } from '@upstash/redis'

// Upstash Redis istemcisi — UPSTASH_REDIS_REST_URL ve UPSTASH_REDIS_REST_TOKEN okur.
// Vercel Dashboard'dan: Settings → Environment Variables → her ikisini de ekle.
const redis = Redis.fromEnv()

/**
 * Redis tabanlı rate limiter (INCR + TTL pipeline).
 * Vercel serverless cold start'lardan etkilenmez; tüm paralel instance'larda çalışır.
 * Fonksiyon imzası kasıtlı olarak eski in-memory sürümle uyumlu tutuldu (async hale getirildi).
 */
export async function rateLimit(
  anahtar: string,
  limit: number,
  pencereSn: number
): Promise<{ basarili: boolean; kalan: number; resetT: number }> {
  const now = Date.now()
  const key = `rl:${anahtar}`

  // Atomic pipeline: tek round-trip'te INCR + TTL
  const pipe = redis.pipeline()
  pipe.incr(key)
  pipe.ttl(key)

  const [count, ttl] = (await pipe.exec()) as [number, number]

  // İlk istek ise pencere süresini ayarla
  if ((count as number) === 1) {
    await redis.expire(key, pencereSn)
  }

  const resetT = now + (ttl > 0 ? ttl * 1000 : pencereSn * 1000)

  if ((count as number) > limit) {
    return { basarili: false, kalan: 0, resetT }
  }

  return {
    basarili: true,
    kalan: Math.max(0, limit - (count as number)),
    resetT,
  }
}

export function istemciKimligi(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'anon'
}
