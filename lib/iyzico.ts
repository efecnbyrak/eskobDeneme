import Iyzipay from 'iyzipay'

let _iyzipay: Iyzipay | null = null

export function getIyzipay(): Iyzipay {
  if (!_iyzipay) {
    _iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY!,
      secretKey: process.env.IYZICO_SECRET_KEY!,
      uri: process.env.IYZICO_BASE_URL ?? 'https://sandbox.iyzipay.com',
    })
  }
  return _iyzipay
}

export const PLAN_FIYAT: Record<string, { fiyat: string; ad: string }> = {
  STARTER: { fiyat: '200.0', ad: 'Gold Plan' },
  PRO: { fiyat: '500.0', ad: 'Premium Plan' },
}
