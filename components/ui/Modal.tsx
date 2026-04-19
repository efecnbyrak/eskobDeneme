'use client'

import { ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  acik: boolean
  kapat: () => void
  children: ReactNode
  baslik?: string
  className?: string
}

export function Modal({ acik, kapat, children, baslik, className }: ModalProps) {
  useEffect(() => {
    if (acik) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [acik])

  if (!acik) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={kapat}
      />
      <div
        className={cn(
          'relative bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-lg max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        {baslik && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              {baslik}
            </h3>
            <button
              onClick={kapat}
              className="p-1 hover:bg-[var(--color-bg-muted)] rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
