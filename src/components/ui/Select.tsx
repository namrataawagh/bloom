import { forwardRef, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption { value: string; label: string }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options?: SelectOption[]
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, children, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-body-sm font-medium text-graphite">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 pl-3.5 pr-9 text-body text-ink bg-white appearance-none cursor-pointer',
              'border border-ash rounded-xl',
              'focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10/10',
              'transition-all duration-150',
              'shadow-craft-subtle',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-papaya',
              className
            )}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone pointer-events-none" />
        </div>
        {error && <p className="text-caption text-papaya">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
