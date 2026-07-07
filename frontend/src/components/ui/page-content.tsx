import * as React from "react"
import { cn } from "../../lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function PageContainer({ 
  className, 
  children, 
  as: Component = "section", // Par défaut, ce sera une balise <section>
  ...props 
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        // Flexbox & Alignement
        "flex flex-col items-center w-full max-w-[720px] text-center min-w-0 break-words",
        // Effet Glassmorphism (Fond noir transparent + flou)
        "bg-black/40 backdrop-blur-md",
        // Espacement et bordures
        "p-4 sm:p-6 md:p-8 rounded-2xl border border-white/10",
        // Ombre portée
        "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}