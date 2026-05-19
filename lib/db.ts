import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// pg paketi channel_binding parametresini desteklemiyor; bağlantıdan temizle
function sanitizeConnectionString(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.delete('channel_binding')
    return parsed.toString()
  } catch {
    return url
  }
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL
  if (!raw) {
    throw new Error(
      'DATABASE_URL env değişkeni tanımlı değil. .env.local içinde Neon bağlantısını ayarlayın.'
    )
  }
  const connectionString = sanitizeConnectionString(raw)
  const adapter = new PrismaPg({
    connectionString,
    // max: 1 kaldırıldı — Neon pgBouncer pooled endpoint havuzu kendisi yönetiyor.
    // DATABASE_URL olarak Neon'un "-pooler" suffix'li URL'ini kullanın.
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000, // 5s → 10s: Neon cold start toleransı için artırıldı
  })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

globalForPrisma.prisma = prisma
