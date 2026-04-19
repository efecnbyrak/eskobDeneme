import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
        'shadow-[var(--shadow-sm)]',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div {...props} className={cn('px-6 py-4 border-b border-[var(--color-border)]', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }: CardProps) {
  return (
    <div {...props} className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}
