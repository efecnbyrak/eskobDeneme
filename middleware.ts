import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Public sayfalar — herkes erişebilir
const PUBLIC_EXACT = new Set([
  '/',
  '/giris',
  '/kayit',
  '/isletme',
  '/isletme/giris',
  '/isletme/kayit',
  '/musteri/giris',
  '/musteri/kayit',
])

// Prefix ile public sayfalar
const PUBLIC_PREFIXES = [
  '/api/',
  '/_next/',
  '/isletme/gizlilik',
  '/isletme/kullanim',
  '/isletme/iletisim',
  '/isletme/ozellikler',
  '/isletme/nasil-calisir',
  '/musteri/',
  '/gizlilik',
  '/kullanim',
  '/iletisim',
  '/sitemap',
  '/robots',
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const rol = req.auth?.user?.rol as string | undefined

  // Public prefix kontrolü — direkt geç
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Slug tabanlı public sayfalar (/:sehir/:slug)
  const segmentCount = pathname.split('/').filter(Boolean).length
  if (segmentCount === 2 && !pathname.startsWith('/isletme') && !pathname.startsWith('/phyberk') && !pathname.startsWith('/hesabim') && !pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // === İŞLETME PUBLIC SAYFALARI ===
  // /isletme, /isletme/giris, /isletme/kayit — giriş yapmamış veya BUSINESS geçebilir
  if (
    pathname === '/isletme' ||
    pathname === '/isletme/giris' ||
    pathname === '/isletme/kayit'
  ) {
    if (rol === 'USER') {
      return NextResponse.redirect(new URL('/hesabim', req.url))
    }
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin', req.url))
    }
    // BUSINESS: /isletme'de kalabilir; /isletme/giris ve /isletme/kayit → panele yönlendir
    if (rol === 'BUSINESS' && (pathname === '/isletme/giris' || pathname === '/isletme/kayit')) {
      return NextResponse.redirect(new URL('/isletme/panel', req.url))
    }
    return NextResponse.next()
  }

  // === GENEL PUBLIC SAYFALAR (/giris, /kayit vb.) ===
  if (PUBLIC_EXACT.has(pathname)) {
    if (rol === 'BUSINESS') return NextResponse.redirect(new URL('/isletme/panel', req.url))
    if (rol === 'USER') return NextResponse.redirect(new URL('/hesabim', req.url))
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') return NextResponse.redirect(new URL('/phyberk/admin', req.url))
    return NextResponse.next()
  }

  // === KORUNAN İŞLETME PANEL ROTALARI (/isletme/panel, /isletme/genel, vb.) ===
  if (pathname.startsWith('/isletme/')) {
    if (!rol) {
      return NextResponse.redirect(new URL('/isletme/giris', req.url))
    }
    if (rol === 'USER') {
      return NextResponse.redirect(new URL('/hesabim', req.url))
    }
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin', req.url))
    }
    // BUSINESS → izin ver
    return NextResponse.next()
  }

  // === KORUNAN KULLANICI ROTALARI (/hesabim) ===
  if (pathname.startsWith('/hesabim') || pathname === '/genel' || pathname === '/favorilerim' || pathname === '/randevularim' || pathname === '/yorumlarim') {
    if (!rol) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
    if (rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/isletme/panel', req.url))
    }
    if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') {
      return NextResponse.redirect(new URL('/phyberk/admin', req.url))
    }
    return NextResponse.next()
  }

  // === ADMIN ROTALARI ===
  if (pathname.startsWith('/phyberk/')) {
    if (!rol) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
    if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)',
  ],
}
