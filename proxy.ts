import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Rol = 'SUPER_ADMIN' | 'ADMIN' | 'BUSINESS' | 'USER'

const ADMIN_PATHS = ['/phyberk/admin']
const BUSINESS_PATHS = ['/panel']
const USER_PATHS = ['/user']
const AUTH_PATHS = ['/giris', '/kayit']

function matchesAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function homeForRole(rol?: Rol | string | null): string {
  if (rol === 'SUPER_ADMIN' || rol === 'ADMIN') return '/phyberk/admin'
  if (rol === 'BUSINESS') return '/panel'
  if (rol === 'USER') return '/user'
  return '/'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  }).catch(() => null)

  const rol = token?.rol as Rol | undefined
  const isAuthenticated = !!token

  if (matchesAny(pathname, AUTH_PATHS)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  if (matchesAny(pathname, ADMIN_PATHS)) {
    if (!isAuthenticated) {
      const url = new URL('/giris', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  if (matchesAny(pathname, BUSINESS_PATHS)) {
    if (!isAuthenticated) {
      const url = new URL('/giris', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (rol !== 'BUSINESS' && rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  if (matchesAny(pathname, USER_PATHS)) {
    if (!isAuthenticated) {
      const url = new URL('/giris', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (rol === 'BUSINESS') {
      return NextResponse.redirect(new URL('/panel', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/giris',
    '/kayit',
    '/panel/:path*',
    '/user/:path*',
    '/phyberk/:path*',
  ],
}
