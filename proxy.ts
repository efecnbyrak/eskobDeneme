import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const oturum = await auth()

  if (pathname.startsWith('/panel') && !oturum) {
    return NextResponse.redirect(new URL('/giris', request.url))
  }

  if ((pathname === '/giris' || pathname === '/kayit') && oturum) {
    return NextResponse.redirect(new URL('/panel', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel/:path*', '/giris', '/kayit'],
}
