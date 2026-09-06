import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
}

export function PageContainer({ children, className, maxWidth = '7xl' }: PageContainerProps) {
  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-3xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    "7xl": "max-w-[1400px]",
    full: "max-w-full"
  }
  return (
    <div className={cn("w-full mx-auto px-4 md:px-6 py-6", maxWidths[maxWidth], className)}>
      {children}
    </div>
  )
}
