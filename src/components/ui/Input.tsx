import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-graphite mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 px-3.5 rounded-[12px] bg-white border text-[14px] text-ink placeholder:text-stone transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-graphite',
            error ? 'border-red-400' : 'border-ash hover:border-stone',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
        {hint  && <p className="mt-1 text-[12px] text-stone">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-[13px] font-medium text-graphite mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-[12px] bg-white border text-[14px] text-ink placeholder:text-stone resize-none transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-graphite',
            error ? 'border-red-400' : 'border-ash hover:border-stone',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
