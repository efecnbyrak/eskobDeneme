import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--color-bg-muted)] rounded-[var(--radius-md)]',
        className
      )}
    />
  )
}

export function EsnafKartSkeleton() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
