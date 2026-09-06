import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
          <div className={cn(
            "w-11 h-6 bg-input rounded-full peer peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2",
            className
          )} />
          <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </div>
        {label && <span className="text-sm font-medium">{label}</span>}
      </label>
    )
  }
)
Switch.displayName = "Switch"
export { Switch }
