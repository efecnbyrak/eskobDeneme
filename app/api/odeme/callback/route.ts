import { NextRequest, NextResponse } from 'next/server'
import { getIyzipay } from '@/lib/iyzico'
import { prisma } from '@/lib/db'

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

      if (!kullaniciId || !['STARTER', 'PRO'].includes(plan)) {
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
