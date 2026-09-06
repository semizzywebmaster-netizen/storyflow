import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type="range"
          className={cn(
            "w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"
export { Slider }
