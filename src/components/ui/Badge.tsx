import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'mint' | 'marigold' | 'periwinkle' | 'stone' | 'papaya'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const variantClasses: Record<BadgeVariant, string> = {
  'default':    'bg-linen text-graphite border border-ash',
  'mint':       'bg-mint/20 text-graphite border border-mint/40',
  'marigold':   'bg-marigold/30 text-graphite border border-marigold/50',
  'periwinkle': 'bg-periwinkle/20 text-graphite border border-periwinkle/40',
  'stone':      'bg-cloud text-stone border border-ash',
  'papaya':     'bg-papaya/10 text-papaya border border-papaya/30',
}

const sizeClasses: Record<BadgeSize, string> = {
  'sm': 'text-caption px-2 py-0.5',
  'md': 'text-body-sm px-3 py-1',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'sm', className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium rounded-pill whitespace-nowrap font-sans',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = 'Badge'
