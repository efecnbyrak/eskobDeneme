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
    <form onSubmit={handleAra} className="relative w-full max-w-3xl mx-auto z-10 group">
      {/* Decorative Glow Behind Search */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
      
      <div className="relative flex items-center bg-white rounded-full overflow-hidden transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-[var(--color-primary-light)] shadow-sm border border-[var(--color-border)]">
        <div className="flex items-center pl-6 pr-3 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          value={sehir}
          onChange={(e) => setSehir(e.target.value)}
          placeholder="İşletme, esnaf veya şehir ara..."
          className="flex-1 px-3 py-5 text-lg font-medium bg-transparent outline-none placeholder:text-[var(--color-text-secondary)]/60 text-[var(--color-text)]"
        />
        <button
          type="submit"
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-base font-semibold px-8 py-4 mr-1.5 rounded-full transition-all duration-300 cursor-pointer shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Ara
        </button>
      </div>
    </form>
  )
}
