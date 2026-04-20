import type { Rol } from '@/lib/auth'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    rol?: Rol
  }

  interface Session {
    user: {
      id?: string
      rol?: Rol
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
  }
}
