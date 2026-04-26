import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

const ADMIN_PATHS = ['/phyberk/admin']
const BUSINESS_PATHS = ['/panel', '/isletme/panel']
const ACCOUNT_PATHS = ['/genel', '/favorilerim', '/randevularim', '/ayarlar', '/yorumlarim', '/profil']
const AUTH_PATHS = [
  '/giris',
  '/kayit',
  '/musteri/giris',
  '/musteri/kayit',
  '/isletme/giris',
  '/isletme/kayit',
]

const PUBLIC_ISLETME_SAYFALARI = new Set([
  '/isletme/iletisim',
  '/isletme/gizlilik',
  '/isletme/kullanim',
  '/isletme/nasil-calisir',
])

function matchesAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function homeForRole(rol?: Rol | string | null): string {
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') return '/phyberk/admin'
  if (rol === 'BUSINESS') return '/isletme/panel'
  if (rol === 'USER') return '/'
  return '/'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // CORS preflight
  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    return new NextResponse(null, { status: 204 })
  }

  // API rotaları kendi auth kontrollerini yapar
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const oturum = await auth()
  const rol = oturum?.user?.rol as Rol | undefined
  const isAuthenticated = !!oturum?.user

  // Auth sayfaları: giriş yapmışları yönlendir
  if (matchesAny(pathname, AUTH_PATHS)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // Kimlik doğrulanmamış: tüm sayfalara erişim engellenir → /giris
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/giris', request.url))
  }

  // ── Kimliği doğrulanmış kullanıcılar ──

  // Ana sayfa
  if (pathname === '/') {
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin', request.url))
    }
    if (rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/isletme/panel', request.url))
    }
    return NextResponse.next()
  }

  // Admin rotaları
  if (matchesAny(pathname, ADMIN_PATHS)) {
    if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // İşletme paneli
  if (matchesAny(pathname, BUSINESS_PATHS)) {
    if (rol !== 'BUSINESS' && rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // Hesap sayfaları (USER rolü için)
  if (matchesAny(pathname, ACCOUNT_PATHS)) {
    if (rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/isletme/panel', request.url))
    }
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin', request.url))
    }
    return NextResponse.next()
  }

  // İşletme landing (/isletme/*): USER giremez
  if (
    pathname === '/isletme' ||
    (pathname.startsWith('/isletme/') &&
      !PUBLIC_ISLETME_SAYFALARI.has(pathname) &&
      !pathname.startsWith('/isletme/giris') &&
      !pathname.startsWith('/isletme/kayit') &&
      !pathname.startsWith('/isletme/panel'))
  ) {
    if (rol === 'USER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)).*)',
  ],
}
