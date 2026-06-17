// src/components/ui/heading.tsx
import * as React from "react"
import { cn } from "../../lib/utils"

// L'interface permet de conserver toutes les propriétés natives d'un <h1> (id, onClick, etc.)
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h1 
      // Les classes par défaut sont définies ici
      className={cn(
        "scroll-m-20 text-4xl tracking-tight lg:text-5xl", 
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  )
}