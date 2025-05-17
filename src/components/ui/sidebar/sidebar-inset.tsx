
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "flex-1 min-h-screen overflow-y-auto overflow-x-hidden bg-background transition-all duration-300",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
