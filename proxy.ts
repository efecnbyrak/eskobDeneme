import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Session } from 'next-auth'

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

  let oturum: Session | null = null
  try {
    oturum = (await auth()) as Session | null
  } catch {
    oturum = null
  }

  const rol = (oturum?.user as { rol?: Rol } | undefined)?.rol

  if (matchesAny(pathname, AUTH_PATHS)) {
    if (oturum) {
      return NextResponse.redirect(new URL(homeForRole(rol), request.url))
    }
    return NextResponse.next()
  }

  if (matchesAny(pathname, ADMIN_PATHS)) {
    if (!oturum) {
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
    if (!oturum) {
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
    if (!oturum) {
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
