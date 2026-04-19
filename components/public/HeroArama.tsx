'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function HeroArama() {
  const router = useRouter()
  const [sehir, setSehir] = useState('')

  function handleAra(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (sehir.trim()) params.set('sehir', sehir.trim())
    router.push(`/ara${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <form onSubmit={handleAra} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <input
        value={sehir}
        onChange={(e) => setSehir(e.target.value)}
        placeholder="Şehir veya esnaf adı girin..."
        className="flex-1 px-5 py-3 rounded-[var(--radius-full)] border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] bg-white shadow-[var(--shadow-sm)]"
      />
      <Button type="submit" size="lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Esnaf Ara
      </Button>
    </form>
  )
}
