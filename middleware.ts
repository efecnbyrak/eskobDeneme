import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const AUTH_ROUTES = [
  '/giris',
  '/musteri/giris',
  '/musteri/kayit',
  '/isletme/giris',
  '/isletme/kayit',
]

const PROTECTED_ROUTES = [
  '/genel',
  '/favorilerim',
  '/randevularim',
  '/yorumlarim',
  '/ayarlar',
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth?.user?.id

  // Giriş yapmış kullanıcıyı auth sayfalarından yönlendir
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    const rol = req.auth!.user.rol
    const kullaniciAdi = req.auth!.user.kullaniciAdi
    let hedef = '/hesabim'
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') hedef = '/phyberk/admin'
    else if (rol === 'BUSINESS') hedef = '/isletme/panel'
    else hedef = kullaniciAdi ? `/${kullaniciAdi}/genel` : '/hesabim'
    return NextResponse.redirect(new URL(hedef, req.url))
  }

  // Giriş yapmamış kullanıcıyı korunan sayfalardan yönlendir
  if (!isAuthenticated && PROTECTED_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    const loginUrl = new URL('/giris', req.url)
    loginUrl.searchParams.set('sonra', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // /hesabim/* koruması
  if (!isAuthenticated && pathname.startsWith('/hesabim')) {
    const loginUrl = new URL('/giris', req.url)
    loginUrl.searchParams.set('sonra', pathname)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  matcher: [
    '/giris',
    '/musteri/giris',
    '/musteri/kayit',
    '/isletme/giris',
    '/isletme/kayit',
    '/genel/:path*',
    '/favorilerim/:path*',
    '/randevularim/:path*',
    '/yorumlarim/:path*',
    '/ayarlar/:path*',
    '/hesabim/:path*',
    // exact matches (no trailing slash)
    '/genel',
    '/favorilerim',
    '/randevularim',
    '/yorumlarim',
    '/ayarlar',
  ],
}
