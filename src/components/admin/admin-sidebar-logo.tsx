
import { memo } from "react";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/ui/app-logo";
import { Menu } from "lucide-react";

interface SidebarLogoProps {
  isCollapsed: boolean;
  handleToggleCollapse?: () => void;
}

export const SidebarLogo = memo(({ isCollapsed, handleToggleCollapse }: SidebarLogoProps) => {
  return (
    <div className={cn(
      "transition-all duration-300 flex items-center justify-between w-full",
      isCollapsed ? "px-2" : "px-4"
    )}>
      {isCollapsed ? (
        <AppLogo variant="icon" className="transition-all duration-300 mx-auto" />
      ) : (
        <>
          <AppLogo className="transition-all duration-300" />
          <button
            onClick={handleToggleCollapse}
            className="text-muted-foreground hover:text-primary p-1 rounded-md hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
        </>
      )}
    </div>
  );
});

SidebarLogo.displayName = "SidebarLogo";
