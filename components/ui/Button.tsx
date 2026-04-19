'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none leading-none'

  const variantStyles = {
    primary:
      'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-sm hover:shadow-md',
    secondary:
      'bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]',
    ghost:
      'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  }

  const sizeStyles = {
    sm: 'text-sm px-6 py-3 min-h-[44px]',
    md: 'text-sm px-8 py-3.5 min-h-[48px]',
    lg: 'text-base px-10 py-4 min-h-[56px]',
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        base,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
