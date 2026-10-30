import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  )
}

interface DialogContentProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DialogContent({ children, size = 'md', className }: DialogContentProps) {
  const maxW = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg'

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-50 animate-fade-in" />
      <RadixDialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full',
          'bg-white rounded-3xl border border-ash shadow-craft-xl',
          'animate-slide-up focus:outline-none',
          maxW,
          className
        )}
      >
        {children}
        <RadixDialog.Close asChild>
          <button
            className="absolute top-4 right-4 p-2 rounded-xl text-stone hover:text-graphite hover:bg-cloud transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-6 pt-6 pb-0', className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <RadixDialog.Title className={cn('font-serif text-2xl font-normal text-ink tracking-tight', className)}>
      {children}
    </RadixDialog.Title>
  )
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 pb-6 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  )
}
