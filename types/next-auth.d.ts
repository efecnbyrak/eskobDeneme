import type { Rol } from '@/lib/auth'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    rol?: Rol
    ad?: string
    soyad?: string
    kullaniciAdi?: string | null
  }

  interface Session {
    user: {
      id?: string
      rol?: Rol
      ad?: string
      soyad?: string
      kullaniciAdi?: string | null
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    rol?: Rol
    ad?: string
    soyad?: string
    kullaniciAdi?: string | null
  }
}
