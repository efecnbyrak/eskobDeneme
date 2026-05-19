import { NextRequest, NextResponse } from 'next/server'
import { getIyzipay, PLAN_FIYAT } from '@/lib/iyzico'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const token = form.get('token') as string | null

  if (!token) {
    return NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=hata', req.url))
  }

  const iyzipay = getIyzipay()

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, async (err: unknown, result: Record<string, unknown>) => {
      if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
        resolve(NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=hata', req.url)))
        return
      }

      // conversationId formatı: "kullaniciId-PLAN-timestamp"
      const conversationId = result.conversationId as string
      const parcalar = conversationId.split('-')
      const kullaniciId = parseInt(parcalar[0])
      const plan = parcalar[1] as 'STARTER' | 'PRO'
      const timestamp = parseInt(parcalar[2] || '0')

      // Timestamp kontrolü: 2 saatten eski token'lar reddedilir (replay saldırısı önlemi)
      const ikiSaatOnce = Date.now() - 2 * 60 * 60 * 1000
      if (!timestamp || timestamp < ikiSaatOnce) {
        logger.warn('odeme.token_suresi_dolmus', { conversationId, timestamp })
        resolve(NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=hata', req.url)))
        return
      }

      if (!kullaniciId || !['STARTER', 'PRO'].includes(plan)) {
        resolve(NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=hata', req.url)))
        return
      }

      // Fiyat doğrulaması: ödenen tutar beklenen plan fiyatıyla eşleşmeli
      const beklenenFiyat = PLAN_FIYAT[plan]?.fiyat
      const odenenFiyat = result.price as string | undefined
      if (beklenenFiyat && odenenFiyat && odenenFiyat !== beklenenFiyat) {
        logger.warn('odeme.fiyat_uyumsuzlugu', { beklenen: beklenenFiyat, odenen: odenenFiyat, kullaniciId })
        resolve(NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=hata', req.url)))
        return
      }

      const planBitisTarihi = new Date()
      planBitisTarihi.setMonth(planBitisTarihi.getMonth() + 1)

      try {
        await prisma.kullanici.update({
          where: { id: kullaniciId },
          data: { plan, planBitisTarihi },
        })
        resolve(NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=basarili', req.url)))
      } catch {
        resolve(NextResponse.redirect(new URL('/isletme/panel/ayarlar?odeme=hata', req.url)))
      }
    })
  })
}
