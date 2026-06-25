import * as React from "react"
import { cn } from "../../lib/utils"

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function GlassPanel({ className, children, hoverEffect = false, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "bg-white/5 border border-white/10 rounded-xl p-4 text-white",
        hoverEffect && "transition-all duration-200 hover:border-white/20 hover:bg-white/10 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
