// src/components/ui/heading.tsx
import * as React from "react"
import { cn } from "../../lib/utils"

// L'interface permet de conserver toutes les propriétés natives d'un <h1> (id, onClick, etc.)
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h1 
      // Style "Minimaliste / Tech"
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