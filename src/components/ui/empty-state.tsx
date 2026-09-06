import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-muted/20", className)}>
      {icon && <div className="mb-4 p-4 rounded-full bg-muted text-muted-foreground">{icon}</div>}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>}
      {action && <Button onClick={action.onClick} variant="studio">{action.label}</Button>}
    </div>
  )
}
