import * as React from "react"

import { cn } from "../../lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-4 py-3 rounded-[10px] border border-white/10 bg-[#0f172a] text-[#e5e7eb] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-blue-500/50 outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
