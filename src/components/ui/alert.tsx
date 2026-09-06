import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  title?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    const icons = {
      default: Info,
      destructive: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info
    }
    const Icon = icons[variant]
    const variants = {
      default: "bg-background text-foreground border",
      destructive: "border-destructive/50 text-destructive dark:border-destructive bg-destructive/10",
      success: "border-green-500/20 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300",
      warning: "border-amber-500/20 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
      info: "border-blue-500/20 bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
    }
    return (
      <div
        ref={ref}
        role="alert"
        className={cn("relative w-full rounded-xl border p-4 flex gap-3", variants[variant], className)}
        {...props}
      >
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
          <div className="text-sm [&_p]:leading-relaxed">{children}</div>
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"
export { Alert }
