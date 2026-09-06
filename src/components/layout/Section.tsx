import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export function Section({ children, className, title, description, action }: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
