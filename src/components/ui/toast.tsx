import { useUIStore } from '@/stores/uiStore'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, removeToast } = useUIStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : toast.type === 'warning' ? AlertTriangle : Info
        return (
          <div
            key={toast.id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-start space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg backdrop-blur-xl mb-2 transition-all",
              "bg-background/90 border-border",
              toast.type === 'success' && "border-green-500/20 bg-green-50/90 dark:bg-green-950/30",
              toast.type === 'error' && "border-red-500/20 bg-red-50/90 dark:bg-red-950/30",
              toast.type === 'warning' && "border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/30"
            )}
          >
            <Icon className={cn("h-5 w-5 mt-0.5 shrink-0",
              toast.type === 'success' && "text-green-600",
              toast.type === 'error' && "text-red-600",
              toast.type === 'warning' && "text-amber-600",
              toast.type === 'info' && "text-blue-600"
            )} />
            <div className="flex-1 space-y-1">
              <div className="text-sm font-semibold">{toast.title}</div>
              {toast.description && (
                <div className="text-sm opacity-90">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
