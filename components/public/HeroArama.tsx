'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <form onSubmit={handleAra} className="relative max-w-xl mx-auto">
      <div className="flex items-center bg-white rounded-full border border-[var(--color-border)] shadow-[var(--shadow-md)] overflow-hidden focus-within:border-[var(--color-primary)] focus-within:shadow-lg transition-all">
        <div className="flex items-center pl-5 text-[var(--color-text-secondary)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          value={sehir}
          onChange={(e) => setSehir(e.target.value)}
          placeholder="Şehir veya esnaf adı yazın..."
          className="flex-1 px-4 py-4 text-sm bg-transparent outline-none placeholder:text-[var(--color-text-secondary)]"
        />
        <button
          type="submit"
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold px-6 py-3 mr-1.5 rounded-full transition-colors cursor-pointer shrink-0"
        >
          Ara
        </button>
      </div>
    </form>
  )
}
