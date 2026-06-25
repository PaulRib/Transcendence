import * as React from "react"
import { cn } from "../../lib/utils"

export function FormError({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p className={cn("mt-4 text-red-400 whitespace-pre-line text-sm text-center font-medium", className)} {...props}>
      {children}
    </p>
  )
}
