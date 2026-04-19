import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
    success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-500',
    info: 'bg-[var(--color-turquoise-light)] text-[var(--color-primary)]',
  }

  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
