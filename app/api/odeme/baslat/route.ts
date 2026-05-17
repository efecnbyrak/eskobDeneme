import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getIyzipay, PLAN_FIYAT } from '@/lib/iyzico'

export async function POST(req: NextRequest) {
  const oturum = await auth()
  if (!oturum?.user?.email) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { plan } = await req.json()
  if (!plan || !PLAN_FIYAT[plan]) {
    return NextResponse.json({ error: 'Geçersiz plan' }, { status: 400 })
  }

  const kullanici = await prisma.kullanici.findUnique({
    where: { email: oturum.user.email },
    include: { esnaf: true },
  })
  if (!kullanici) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  const planBilgi = PLAN_FIYAT[plan]
  const iyzipay = getIyzipay()
  const callbackUrl = `${process.env.NEXTAUTH_URL}/api/odeme/callback`

  const request = {
    locale: 'tr',
    conversationId: `${kullanici.id}-${plan}-${Date.now()}`,
    price: planBilgi.fiyat,
    paidPrice: planBilgi.fiyat,
    currency: 'TRY',
    basketId: `B${kullanici.id}`,
    paymentGroup: 'SUBSCRIPTION',
    callbackUrl,
    enabledInstallments: ['1', '2', '3', '6', '9'],
    buyer: {
      id: String(kullanici.id),
      name: kullanici.ad,
      surname: kullanici.soyad,
      gsmNumber: kullanici.esnaf?.telefon ?? '+905000000000',
      email: kullanici.email,
      identityNumber: '11111111111',
      registrationAddress: 'Türkiye',
      ip: req.headers.get('x-forwarded-for') ?? '127.0.0.1',
      city: 'Istanbul',
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: `${kullanici.ad} ${kullanici.soyad}`,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Türkiye',
    },
    billingAddress: {
      contactName: `${kullanici.ad} ${kullanici.soyad}`,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Türkiye',
    },
    basketItems: [
      {
        id: plan,
        name: planBilgi.ad,
        category1: 'Abonelik',
        itemType: 'VIRTUAL',
        price: planBilgi.fiyat,
      },
    ],
  }

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: Record<string, unknown>) => {
      if (err || result.status !== 'success') {
        resolve(NextResponse.json({ error: 'Ödeme formu oluşturulamadı', detay: result }, { status: 500 }))
        return
      }
      resolve(NextResponse.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
      }))
    })
  })
}
