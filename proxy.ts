import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

const ADMIN_PATHS = ['/phyberk/admin']
const BUSINESS_PATHS = ['/panel', '/isletme/panel']
const MUSTERI_GENEL_PATHS = ['/musteri/genel', '/hesabim']
const AUTH_PATHS = [
  '/giris', '/kayit',
  '/musteri/kayit',
  '/isletme/kayit',
]

// /musteri/giris ve /isletme/giris client-side handle edilir (zaten giriş popup'u için)

function matchesAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function homeForRole(rol?: Rol | string | null): string {
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') return '/phyberk/admin'
  if (rol === 'BUSINESS') return '/isletme/panel'
  if (rol === 'USER') return '/hesabim'
  return '/'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const oturum = await auth()
  const rol = oturum?.user?.rol as Rol | undefined
  const isAuthenticated = !!oturum?.user

  // ── Ana sayfa: sadece BUSINESS ve admin kendi alanına, USER ana sayfada kalabilir ──
  if (pathname === '/') {
    if (isAuthenticated && (rol === 'SUPER_ADMIN' || rol === 'ADMIN')) {
      return NextResponse.redirect(new URL('/phyberk/admin', request.url))
    }
    if (isAuthenticated && rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/isletme/panel', request.url))
    }
    if (isAuthenticated && rol === 'USER') {
      return NextResponse.redirect(new URL('/hesabim', request.url))
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

  // ── Müşteri hesap alanı (/musteri/genel/*) ──
  if (matchesAny(pathname, MUSTERI_GENEL_PATHS)) {
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
      !pathname.startsWith('/musteri/giris') &&
      !pathname.startsWith('/musteri/kayit') &&
      !pathname.startsWith('/musteri/genel'))
  ) {
    if (isAuthenticated && (rol === 'BUSINESS' || rol === 'SUPER_ADMIN' || rol === 'ADMIN')) {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  // ── İşletme landing (/isletme/*): USER girişli kullanıcılar erişemez ──
  if (
    pathname === '/isletme' ||
    (pathname.startsWith('/isletme/') &&
      !pathname.startsWith('/isletme/giris') &&
      !pathname.startsWith('/isletme/kayit') &&
      !pathname.startsWith('/isletme/panel'))
  ) {
    if (isAuthenticated && rol === 'USER') {
      return NextResponse.redirect(new URL('/hesabim', request.url))
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
    '/hesabim',
    '/panel/:path*',
    '/isletme/panel/:path*',
    '/musteri',
    '/musteri/:path*',
    '/isletme',
    '/isletme/:path*',
    '/phyberk/:path*',
  ],
}
