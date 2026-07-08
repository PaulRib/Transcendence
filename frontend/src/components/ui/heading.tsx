import * as React from "react"
import { cn } from "../../lib/utils"

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h1 
      className={cn(
        "scroll-m-20 text-4xl tracking-tight lg:text-5xl mb-8 font-extrabold", 
        "bg-gradient-to-br from-white to-slate-400 text-transparent bg-clip-text drop-shadow-sm",
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  )
}
