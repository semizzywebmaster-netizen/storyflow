import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "h-5 w-5 rounded-md border border-input bg-background peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors flex items-center justify-center group-hover:border-primary/50",
            className
          )}>
            <Check className="h-3 w-3 opacity-0 peer-checked:opacity-100 text-white" />
          </div>
        </div>
        {label && <span className="text-sm font-medium leading-none">{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"
export { Checkbox }
