import { cn } from '@/lib/utils'
import { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--color-bg-muted)] rounded-md',
        className
      )}
      style={style}
    />
  )
}

export function EsnafKartSkeleton() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: '80%' }}>
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  )
}
