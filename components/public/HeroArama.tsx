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
      {/* Subtle glow behind search */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-center bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-[var(--shadow-md)] border border-[var(--color-border)] group-focus-within:border-[var(--color-primary)]/40 group-focus-within:shadow-[var(--shadow-lg)]">
        {/* Search icon */}
        <div className="flex items-center pl-6 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          value={sehir}
          onChange={(e) => setSehir(e.target.value)}
          placeholder="İşletme, esnaf veya şehir ara..."
          className="flex-1 px-4 py-5 text-base sm:text-lg font-medium bg-transparent outline-none placeholder:text-[var(--color-text-secondary)]/50 text-[var(--color-text)] min-h-[56px]"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3.5 mr-2 rounded-xl transition-all duration-300 cursor-pointer shrink-0 shadow-sm hover:shadow-md min-h-[44px]"
        >
          Ara
        </button>
      </div>
    </form>
  )
}
