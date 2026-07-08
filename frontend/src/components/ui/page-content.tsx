import * as React from "react"
import { cn } from "../../lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function PageContainer({ 
  className, 
  children, 
  as: Component = "section",
  ...props 
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "flex flex-col items-center w-full max-w-[720px] text-center min-w-0 break-words",
        "bg-black/40 backdrop-blur-md",
        "p-4 rounded-xl border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
