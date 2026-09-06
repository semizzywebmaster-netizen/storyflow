import * as React from "react"
import { cn } from "@/lib/utils"

interface StudioShellProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

export function StudioShell({ children, sidebar, header, className }: StudioShellProps) {
  return (
    <div className={cn("h-screen flex flex-col bg-background overflow-hidden", className)}>
      {header}
      <div className="flex-1 flex overflow-hidden">
        {sidebar && (
          <div className="w-72 border-r bg-muted/20 overflow-y-auto shrink-0">
            {sidebar}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
