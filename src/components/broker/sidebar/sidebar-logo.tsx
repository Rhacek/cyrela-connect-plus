
import { memo } from "react";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/ui/app-logo";

interface SidebarLogoProps {
  isCollapsed: boolean;
  handleToggleCollapse?: () => void;
}

export const SidebarLogo = memo(({ isCollapsed }: SidebarLogoProps) => {
  return (
    <div className={cn(
      "transition-all duration-300 flex items-center border-b border-cyrela-gray-light",
      isCollapsed ? "justify-center p-3" : "p-4"
    )}>
      {isCollapsed ? (
        <AppLogo variant="icon" className="transition-all duration-300 mx-auto" />
      ) : (
        <AppLogo className="transition-all duration-300" />
      )}
    </div>
  );
});

SidebarLogo.displayName = "SidebarLogo";
