import { cn } from '@/lib/utils'
import { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse', className)}
      style={{ background: 'var(--color-bg-muted)', borderRadius: '8px', ...style }}
    />
  )
}

export function EsnafKartSkeleton() {
  return (
    <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}>
      <div className="relative w-full" style={{ paddingBottom: '80%' }}>
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" style={{ borderRadius: 0 }} />
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton style={{ height: '16px', width: '80%' }} />
        <Skeleton style={{ height: '12px', width: '60%' }} />
        <Skeleton style={{ height: '12px', width: '40%' }} />
      </div>
    </div>
  )
}
