import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { mobilAuth } from '@/lib/auth'
import { basari, hata } from '@/lib/api'

async function getEsnaf(email: string) {
  const k = await prisma.kullanici.findUnique({
    where: { email },
    include: { esnaf: { select: { id: true } } },
  })
  return k?.esnaf ?? null
}

export async function GET(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.email) return hata('Yetkisiz', 401)
  const esnaf = await getEsnaf(oturum.user.email)
  if (!esnaf) return hata('İşletme bulunamadı', 404)

  const kategoriler = await prisma.hizmetKategorisi.findMany({
    where: { esnafId: esnaf.id },
    orderBy: [{ sira: 'asc' }, { olusturmaT: 'asc' }],
    include: {
      altlar: {
        orderBy: [{ sira: 'asc' }, { olusturmaT: 'asc' }],
      },
    },
  })

  const ustKategoriler = kategoriler.filter((k) => k.ustId === null)

  return basari({ kategoriler: ustKategoriler })
}

export async function POST(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.email) return hata('Yetkisiz', 401)
  const esnaf = await getEsnaf(oturum.user.email)
  if (!esnaf) return hata('İşletme bulunamadı', 404)

  const body = await req.json().catch(() => ({}))
  const ad = typeof body.ad === 'string' ? body.ad.trim() : ''
  if (!ad) return hata('Kategori adı gerekli', 400)

  const ustId = typeof body.ustId === 'number' ? body.ustId : null

  if (ustId) {
    const ust = await prisma.hizmetKategorisi.findFirst({
      where: { id: ustId, esnafId: esnaf.id },
    })
    if (!ust) return hata('Üst kategori bulunamadı', 404)
    if (ust.ustId !== null) return hata('Maksimum 2 seviye kategori destekleniyor', 400)
  }

  const yeni = await prisma.hizmetKategorisi.create({
    data: { ad, esnafId: esnaf.id, ustId },
  })

  return basari({ kategori: yeni }, 201)
}

export async function DELETE(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.email) return hata('Yetkisiz', 401)
  const esnaf = await getEsnaf(oturum.user.email)
  if (!esnaf) return hata('İşletme bulunamadı', 404)

  const { searchParams } = new URL(req.url)
  const id = parseInt(searchParams.get('id') || '')
  if (!id) return hata('ID gerekli', 400)

  const kat = await prisma.hizmetKategorisi.findFirst({
    where: { id, esnafId: esnaf.id },
  })
  if (!kat) return hata('Kategori bulunamadı', 404)

  // Alt kategoriler ve hizmetlerdeki ilişki otomatik temizlenir (SetNull)
  await prisma.hizmetKategorisi.delete({ where: { id } })
  return basari({ ok: true })
}
