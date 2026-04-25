'use client'

import { useEffect, useRef } from 'react'

export function ViewTracker({ esnafId }: { esnafId: number }) {
  const trackedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate tracking in React 18 strict mode or rapid re-renders
    if (trackedRef.current) return

    const trackView = async () => {
      try {
        await fetch('/api/v1/recently-viewed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ esnafId })
        })
        trackedRef.current = true
      } catch (err) {
        console.error('Failed to track view', err)
      }
    }
    
    // We delay slightly to ensure it's a meaningful view and not a bounce
    const timer = setTimeout(trackView, 1500)
    return () => clearTimeout(timer)
  }, [esnafId])

  return null
}
