import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

const ADMIN_PATHS = ['/phyberk/admin/dashboard', '/phyberk/admin/esnaflar', '/phyberk/admin/kategoriler', '/phyberk/admin/kullanicilar', '/phyberk/admin/randevular', '/phyberk/admin/yorumlar']
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

// Kimlik doğrulaması gerektirmeyen rotalar
const HERKESE_ACIK_ROTALAR = new Set(['/', '/ara', '/isletme'])
const HERKESE_ACIK_PREFIXLER = ['/kategori/']

function matchesAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isPublicRoute(pathname: string): boolean {
  if (HERKESE_ACIK_ROTALAR.has(pathname)) return true
  if (HERKESE_ACIK_PREFIXLER.some((p) => pathname.startsWith(p))) return true
  // Tek segment path + korumalı listelerde yoksa = işletme slug sayfası
  // Admin login sayfası herkese açık
  if (pathname === '/phyberk/admin') return true

  const tumKorunanlar = [
    ...ADMIN_PATHS, ...BUSINESS_PATHS, ...ACCOUNT_PATHS, ...AUTH_PATHS,
    '/phyberk',
  ]
  const segments = pathname.split('/').filter(Boolean)
  if (
    segments.length === 1 &&
    !tumKorunanlar.some((p) => pathname === p || pathname.startsWith(p + '/'))
  ) {
    return true
  }
  // Şehir/slug ikili pattern: /sehir/slug
  if (segments.length === 2 && !tumKorunanlar.some((p) => pathname.startsWith(p))) {
    return true
  }
  return false
}

function homeForRole(rol?: Rol | string | null): string {
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') return '/phyberk/admin/dashboard'
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

  // Kimlik doğrulanmamış: herkese açık rotalar serbest, geri kalanlar /giris'e
  if (!isAuthenticated) {
    if (isPublicRoute(pathname)) return NextResponse.next()
    return NextResponse.redirect(new URL('/giris', request.url))
  }

  // ── Kimliği doğrulanmış kullanıcılar ──

  // Admin giriş sayfası — giriş yapmış adminleri doğrudan dashboard'a yönlendir
  if (pathname === '/phyberk/admin') {
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Ana sayfa
  if (pathname === '/') {
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin/dashboard', request.url))
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
