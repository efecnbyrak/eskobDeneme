import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Bu endpoint Vercel Cron tarafından her gece 02:00 UTC'de çağrılır (vercel.json).
// CRON_SECRET env var'ı ile korunur — yetkisiz çağrılar reddedilir.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const simdi = new Date()

  const { count } = await prisma.kullanici.updateMany({
    where: {
      plan: { not: 'UCRETSIZ' },
      planBitisTarihi: { lt: simdi },
      deletedAt: null,
    },
    data: {
      plan: 'UCRETSIZ',
    },
  })

  console.log(
    `[CRON_PLAN_EXPIRE] ${simdi.toISOString()} — ${count} kullanıcının planı UCRETSIZ'e indirildi.`
  )

  return NextResponse.json({
    ok: true,
    indirilen: count,
    tarih: simdi.toISOString(),
  })
}
