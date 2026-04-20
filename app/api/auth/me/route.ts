import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  const oturum = await auth()
  if (!oturum?.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({
    authenticated: true,
    id: oturum.user.id,
    email: oturum.user.email,
    name: oturum.user.name,
    rol: oturum.user.rol ?? 'USER',
  })
}
