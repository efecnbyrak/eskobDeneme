'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  mesaj: string
  tip: ToastType
}

interface ToastContextValue {
  toast: (mesaj: string, tip?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastlar, setToastlar] = useState<Toast[]>([])

  const toast = useCallback((mesaj: string, tip: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToastlar((prev) => [...prev, { id, mesaj, tip }])
    setTimeout(() => {
      setToastlar((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toastlar.map((t) => (
          <div
            key={t.id}
            className={cn(
              'px-5 py-3 rounded-[var(--radius-md)] text-sm font-medium shadow-[var(--shadow-md)] text-white',
              t.tip === 'success' && 'bg-[var(--color-success)]',
              t.tip === 'error' && 'bg-red-500',
              t.tip === 'info' && 'bg-[var(--color-primary)]'
            )}
          >
            {t.mesaj}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
