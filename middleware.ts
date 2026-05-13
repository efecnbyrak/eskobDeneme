import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const ISLETME_PANEL = /^\/isletme\/(panel|genel|randevular|hizmetler|profil|ayarlar|istatistik)/
const ADMIN_PANEL   = /^\/phyberk\/admin/
const MUSTERI_PANEL = /^\/hesabim/

export default auth((req) => {
  const rol = req.auth?.user?.rol
  const path = req.nextUrl.pathname

  if (ISLETME_PANEL.test(path)) {
    if (!rol || (rol !== 'BUSINESS' && rol !== 'ADMIN' && rol !== 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/isletme/giris', req.url))
    }
  }

  if (ADMIN_PANEL.test(path)) {
    if (rol !== 'ADMIN' && rol !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
  }

  if (MUSTERI_PANEL.test(path)) {
    if (!rol) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
  }
})

export const config = {
  matcher: ['/isletme/:path*', '/phyberk/:path*', '/hesabim/:path*'],
}
