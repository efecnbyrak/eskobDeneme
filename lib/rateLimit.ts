// Basit in-memory rate limiter. Serverless cold start'larda sıfırlanır;
// tek instance'lı deploy'lar için ilk savunma hattı. Prod ölçeği için
// Redis (Upstash) ile değiştirin.

type Kayit = { sayi: number; resetT: number }
const store = new Map<string, Kayit>()

export function rateLimit(
  anahtar: string,
  limit: number,
  pencereSn: number
): { basarili: boolean; kalan: number; resetT: number } {
  const simdi = Date.now()
  const mevcut = store.get(anahtar)

  if (!mevcut || mevcut.resetT < simdi) {
    const yeni: Kayit = { sayi: 1, resetT: simdi + pencereSn * 1000 }
    store.set(anahtar, yeni)
    return { basarili: true, kalan: limit - 1, resetT: yeni.resetT }
  }

  if (mevcut.sayi >= limit) {
    return { basarili: false, kalan: 0, resetT: mevcut.resetT }
  }

  mevcut.sayi++
  return { basarili: true, kalan: limit - mevcut.sayi, resetT: mevcut.resetT }
}

export function istemciKimligi(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'anon'
}
