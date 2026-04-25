import { NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

// KVKK Madde 7 — kişisel veri silme / anonimleştirme talebi
export async function POST() {
  const oturum = await auth()
  if (!oturum?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const id = parseInt(oturum.user.id)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Oturum hatası' }, { status: 401 })
  }

  const kullanici = await prisma.kullanici.findUnique({ where: { id } })
  if (!kullanici) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  // SUPER_ADMIN hesabı kendini silemesin (operasyonel koruma)
  if (kullanici.rol === 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Süper admin hesabı self-servis silinemez' },
      { status: 400 }
    )
  }

  try {
    await prisma.$transaction(async (tx) => {
      // PII'yi anonimleştir + soft delete
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

      // BUSINESS ise esnafı pasifleştir (tüm ilişkili veri korunur ama görünmez)
      if (kullanici.rol === 'BUSINESS') {
        await tx.esnaf.updateMany({
          where: { kullaniciId: id },
          data: { aktif: false, onaylı: false },
        })
      }

      // KVKK audit log
      await tx.kvkkLog.create({
        data: {
          kullaniciId: id,
          islem: 'SIL_TALEBI',
          aciklama: `Kullanıcı kendi talebiyle hesabını anonimleştirdi (rol: ${kullanici.rol})`,
        },
      })
    })

    logger.info('kvkk.sil_tamamlandi', { kullaniciId: id, rol: kullanici.rol })

    // Oturumu sonlandır (redirect yapmadan cookie temizle)
    await signOut({ redirect: false }).catch(() => null)

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('kvkk.sil_hata', { kullaniciId: id, err: String(err) })
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
