import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={cn(
            'w-full px-4 py-2.5 text-sm bg-white border border-[var(--color-border)] rounded-[var(--radius-md)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent',
            'placeholder:text-[var(--color-text-secondary)]',
            'transition-all duration-200',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--color-text-secondary)]">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
