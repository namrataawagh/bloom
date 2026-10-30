import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Card container ──────────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ghost' | 'mint' | 'marigold' | 'periwinkle' | 'sky' | 'sky-clouds'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, ...props }, ref) => {
    const variantClass = {
      default:     'bg-white',
      ghost:       'bg-white/60 backdrop-blur border border-white/80',
      mint:        'card-mint',
      marigold:    'card-marigold',
      periwinkle:  'card-periwinkle',
      sky:         'card-sky',
      'sky-clouds':'card-sky-clouds',
    }[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[20px] overflow-hidden',
          variant === 'default' && 'shadow-craft-xl border border-white',
          variant === 'ghost'   && 'shadow-craft-sm',
          hover && variant === 'default' && 'transition-shadow hover:shadow-craft-md',
          variantClass,
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

// ─── Subcomponents ───────────────────────────────────────────────────────────
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 px-6 pt-6 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-[15px] font-semibold text-graphite leading-none tracking-[-0.1px]', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-[13px] text-stone leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center px-6 pb-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
