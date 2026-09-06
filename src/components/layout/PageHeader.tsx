import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function PageHeader({ title, description, action, className, breadcrumbs }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div className="space-y-2">
        {breadcrumbs && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>{bc.label}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-display font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
