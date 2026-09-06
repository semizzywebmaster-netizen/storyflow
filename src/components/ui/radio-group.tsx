import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  label?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, label, ...props }, ref) => {
    return (
      <div className="space-y-3" ref={ref} {...props}>
        {label && <div className="text-sm font-medium">{label}</div>}
        <div className={cn("grid gap-2", className)}>{children}</div>
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer group">
        <input type="radio" className="sr-only peer" ref={ref} {...props} />
        <div className={cn(
          "h-5 w-5 rounded-full border border-input bg-background peer-checked:border-primary peer-checked:border-[5px] transition-all",
          className
        )} />
        {label && <span className="text-sm">{label}</span>}
      </label>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
