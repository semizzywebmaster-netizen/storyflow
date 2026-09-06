import * as React from "react"
import { cn, getInitials } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg"
    }
    return (
      <div
        ref={ref}
        className={cn("relative flex shrink-0 overflow-hidden rounded-full bg-muted", sizes[size], className)}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold">
            {name ? getInitials(name) : "U"}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"
export { Avatar }
