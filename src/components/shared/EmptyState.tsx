import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-[14px] bg-white border border-ash flex items-center justify-center mb-4 shadow-craft-subtle">
        <Icon className="h-5 w-5 text-stone" />
      </div>
      <p className="font-serif text-[20px] text-ink font-normal mb-2">{title}</p>
      {description && <p className="text-[13px] text-stone max-w-xs leading-relaxed mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
