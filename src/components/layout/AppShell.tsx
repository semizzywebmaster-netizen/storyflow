import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  className?: string
  sidebar?: React.ReactNode
}

export function AppShell({ children, className, sidebar }: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <Header />
      <div className="flex">
        {sidebar || <Sidebar />}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
