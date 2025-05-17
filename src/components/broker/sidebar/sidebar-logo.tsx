
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/ui/app-logo";

interface SidebarLogoProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

export function SidebarLogo({ isCollapsed, handleToggleCollapse }: SidebarLogoProps) {
  return (
    <div className={cn(
      "transition-all duration-300 flex items-center border-b border-cyrela-gray-light",
      isCollapsed ? "justify-center p-3" : "p-4"
    )}>
      {isCollapsed ? (
        <AppLogo variant="icon" className="transition-all duration-300" />
      ) : (
        <AppLogo className="transition-all duration-300" />
      )}
    </div>
  );
}
