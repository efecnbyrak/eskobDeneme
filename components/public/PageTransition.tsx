'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Loader } from '@/components/ui/Loader'

export function PageTransition() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const currentPath = useRef(pathname)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element).closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return
      if (href === currentPath.current) return
      setLoading(true)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    setLoading(false)
    currentPath.current = pathname
  }, [pathname])

  if (!loading) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'ptFadeIn 0.15s ease',
    }}>
      <Loader />
      <p style={{ marginTop: 24, fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
        Yükleniyor...
      </p>
      <style>{`
        @keyframes ptFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
