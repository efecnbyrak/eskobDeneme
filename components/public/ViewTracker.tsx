'use client'

import { useEffect } from 'react'

export function ViewTracker({ esnafId }: { esnafId: number }) {
  useEffect(() => {
    // Only track once per page load
    const trackView = async () => {
      try {
        await fetch('/api/v1/recently-viewed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ esnafId })
        })
      } catch (err) {
        console.error('Failed to track view', err)
      }
    }
    
    // We delay slightly to ensure it's a real view and not a bounce
    const timer = setTimeout(trackView, 2000)
    return () => clearTimeout(timer)
  }, [esnafId])

  return null
}
