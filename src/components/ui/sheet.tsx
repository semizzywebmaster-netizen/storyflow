import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
}

export function Sheet({ open, onOpenChange, children, side = 'right' }: SheetProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  if (!open) return null

  const sideClasses = {
    left: "left-0 top-0 h-full w-3/4 sm:max-w-sm animate-in slide-in-from-left",
    right: "right-0 top-0 h-full w-3/4 sm:max-w-sm animate-in slide-in-from-right",
    top: "top-0 left-0 w-full h-1/2 animate-in slide-in-from-top",
    bottom: "bottom-0 left-0 w-full h-1/2 animate-in slide-in-from-bottom"
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className={cn("fixed bg-background border shadow-2xl p-6 overflow-auto", sideClasses[side])}>
        <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-accent">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 mb-4", className)} {...props} />
}
export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />
}
