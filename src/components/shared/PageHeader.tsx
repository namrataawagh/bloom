interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  badge?: string
}

export function PageHeader({ title, description, actions, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {badge && (
          <span className="inline-block text-[11px] font-semibold text-stone uppercase tracking-[0.1em] mb-2">
            {badge}
          </span>
        )}
        <h1 className="font-serif text-[32px] text-ink font-normal leading-tight tracking-[-0.8px]">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-stone mt-1.5 leading-relaxed max-w-lg">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2 mt-1">{actions}</div>}
    </div>
  )
}
