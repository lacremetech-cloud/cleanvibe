'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A15]'

    const variants = {
      primary: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg hover:shadow-violet-500/30 active:scale-95',
      ghost:   'text-[#94A3B8] hover:text-white hover:bg-[#1A1A35] active:scale-95',
      outline: 'border border-[#2A2A50] text-[#F1F5F9] hover:border-[#7C3AED] hover:text-[#A78BFA] active:scale-95',
      danger:  'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 active:scale-95',
    }

    const sizes = {
      sm:   'px-4 py-1.5 text-sm',
      md:   'px-6 py-2.5 text-sm',
      lg:   'px-8 py-3.5 text-base',
      icon: 'p-2 rounded-full',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export default Button
