import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
}

export function Dropdown({ trigger, children, align = 'start' }: DropdownProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 shadow-xl animate-in fade-in",
          align === 'end' ? "right-0" : "left-0",
          "top-full mt-2"
        )}>
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ className, children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }) {
  return (
    <div
      className={cn("relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-muted" />
}
