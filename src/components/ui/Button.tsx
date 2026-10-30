import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:   'bg-ink text-white hover:bg-graphite rounded-[12px] shadow-sm hover:shadow-md',
      secondary: 'bg-white text-ink border border-ash hover:bg-linen rounded-[12px] shadow-craft-subtle hover:shadow-craft-sm',
      outline:   'bg-transparent text-graphite border border-ash hover:bg-white hover:border-graphite rounded-[12px]',
      ghost:     'bg-transparent text-graphite hover:bg-white/60 rounded-[12px]',
      danger:    'bg-red-500 text-white hover:bg-red-600 rounded-[12px] shadow-sm',
    }

    const sizes = {
      sm: 'h-8  px-3.5 text-[13px]',
      md: 'h-10 px-5   text-[14px]',
      lg: 'h-12 px-6   text-[15px]',
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
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
