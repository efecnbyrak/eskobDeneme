import { NextRequest } from 'next/server'
import { mobilAuth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { basari, hata } from '@/lib/api'
import { logger } from '@/lib/logger'

// KVKK Madde 7 — kişisel veri silme / anonimleştirme talebi
export async function POST(req: NextRequest) {
  const oturum = await mobilAuth(req)
  if (!oturum?.user?.id) return hata('Yetkisiz', 401)

  const id = parseInt(oturum.user.id)
  if (!Number.isInteger(id)) return hata('Oturum hatası', 401)

  const kullanici = await prisma.kullanici.findUnique({ where: { id } })
  if (!kullanici) return hata('Kullanıcı bulunamadı', 404)

  if (kullanici.rol === 'SUPER_ADMIN') {
    return hata('Süper admin hesabı self-servis silinemez', 400)
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.kullanici.update({
        where: { id },
        data: {
          email: `silinmis-${id}@anonim.local`,
          telefon: null,
          ad: 'Silinmiş',
          soyad: 'Kullanıcı',
          avatarUrl: null,
          kullaniciAdi: null,
          sifreHash: '',
          ilgiAlanlari: [],
          deletedAt: new Date(),
        },
      })

      if (kullanici.rol === 'BUSINESS') {
        await tx.esnaf.updateMany({
          where: { kullaniciId: id },
          data: { aktif: false, onaylı: false },
        })
      }

      await tx.kvkkLog.create({
        data: {
          kullaniciId: id,
          islem: 'SIL_TALEBI',
          aciklama: `Kullanıcı kendi talebiyle hesabını anonimleştirdi (rol: ${kullanici.rol})`,
        },
      })
    })

    logger.info('kvkk.sil_tamamlandi', { kullaniciId: id, rol: kullanici.rol })
    await signOut({ redirect: false }).catch(() => null)

    return basari({ ok: true })
  } catch (err) {
    logger.error('kvkk.sil_hata', { kullaniciId: id, err: String(err) })
    return hata('Sunucu hatası', 500)
  }
}
