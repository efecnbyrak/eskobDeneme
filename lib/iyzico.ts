import Iyzipay from 'iyzipay'

let _iyzipay: Iyzipay | null = null

export function getIyzipay(): Iyzipay {
  if (!_iyzipay) {
    const baseUrl = process.env.IYZICO_BASE_URL

    // Production'da IYZICO_BASE_URL tanımlı değilse sandbox'a sessizce düşmeyi engelle.
    // Vercel dashboard'dan: Settings → Environment Variables → IYZICO_BASE_URL = https://api.iyzipay.com
    if (process.env.NODE_ENV === 'production' && !baseUrl) {
      throw new Error(
        'IYZICO_BASE_URL env değişkeni production ortamında zorunludur. ' +
        'Vercel dashboard\'ından ayarlayın (canlı: https://api.iyzipay.com).'
      )
    }

    _iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY!,
      secretKey: process.env.IYZICO_SECRET_KEY!,
      uri: baseUrl ?? 'https://sandbox.iyzipay.com',
    })
  }
  return _iyzipay
}

export const PLAN_FIYAT: Record<string, { fiyat: string; ad: string }> = {
  STARTER: { fiyat: '200.0', ad: 'Gold Plan' },
  PRO: { fiyat: '500.0', ad: 'Premium Plan' },
}
