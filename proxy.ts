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

// /isletme/* altında **gerçek public içerik** barındıran yollar (rol redirect dışı)
const PUBLIC_ISLETME_SAYFALARI = new Set([
  '/isletme/iletisim',
  '/isletme/gizlilik',
  '/isletme/kullanim',
  '/isletme/nasil-calisir',
])

// /musteri/* altında public içerik (auth sayfaları zaten ayrıca whitelist'lendi)
const PUBLIC_MUSTERI_SAYFALARI = new Set<string>([])

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

  // ── CORS preflight: hızlıca cevapla ──
  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    return new NextResponse(null, { status: 204 })
  }

  const oturum = await auth()
  const rol = oturum?.user?.rol as Rol | undefined
  const isAuthenticated = !!oturum?.user

  // ── Ana sayfa ──
  if (pathname === '/') {
    if (isAuthenticated && (rol === 'SUPER_ADMIN' || rol === 'ADMIN')) {
      return NextResponse.redirect(new URL('/phyberk/admin', request.url))
    }
    if (isAuthenticated && rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/isletme/panel', request.url))
    }
    return NextResponse.next()
  }

  // ── Auth sayfaları: giriş yapmışları yönlendir ──
  if (matchesAny(pathname, AUTH_PATHS)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // ── Admin rotaları ──
  if (matchesAny(pathname, ADMIN_PATHS)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/giris', request.url))
    }
    if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // ── İşletme paneli ──
  if (matchesAny(pathname, BUSINESS_PATHS)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/isletme/giris', request.url))
    }
    if (rol !== 'BUSINESS' && rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // ── Hesap sayfaları: sadece USER ──
  if (matchesAny(pathname, ACCOUNT_PATHS)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/musteri/giris', request.url))
    }
    if (rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/isletme/panel', request.url))
    }
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin', request.url))
    }
    return NextResponse.next()
  }

  // ── Müşteri landing (/musteri/*): BUSINESS girişli kullanıcılar erişemez ──
  if (
    pathname === '/musteri' ||
    (pathname.startsWith('/musteri/') &&
      !PUBLIC_MUSTERI_SAYFALARI.has(pathname) &&
      !pathname.startsWith('/musteri/giris') &&
      !pathname.startsWith('/musteri/kayit') &&
      !pathname.startsWith('/musteri/panel'))
  ) {
    if (
      isAuthenticated &&
      (rol === 'BUSINESS' || rol === 'SUPER_ADMIN' || rol === 'ADMIN')
    ) {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // ── İşletme landing (/isletme/*): USER girişli kullanıcılar erişemez ──
  // Public sayfalar (iletişim, gizlilik, kullanım, nasıl-çalışır) hariç
  if (
    pathname === '/isletme' ||
    (pathname.startsWith('/isletme/') &&
      !PUBLIC_ISLETME_SAYFALARI.has(pathname) &&
      !pathname.startsWith('/isletme/giris') &&
      !pathname.startsWith('/isletme/kayit') &&
      !pathname.startsWith('/isletme/panel'))
  ) {
    if (isAuthenticated && rol === 'USER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/giris',
    '/kayit',
    '/genel',
    '/favorilerim',
    '/randevularim',
    '/ayarlar',
    '/yorumlarim',
    '/profil',
    '/panel/:path*',
    '/isletme/panel/:path*',
    '/musteri',
    '/musteri/:path*',
    '/isletme',
    '/isletme/:path*',
    '/phyberk/:path*',
    '/api/:path*',
  ],
}
