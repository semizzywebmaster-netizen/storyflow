import { cn } from "@/lib/utils"
import { Button } from "./button"
import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title = "Something went wrong", description = "An error occurred while loading this content.", onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl border bg-destructive/5 border-destructive/20", className)}>
      <div className="mb-4 p-4 rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {onRetry && <Button onClick={onRetry} variant="outline">Try Again</Button>}
    </div>
  )
}
