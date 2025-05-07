
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/ui/app-logo";
import { X } from "lucide-react";

interface SidebarLogoProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

export function SidebarLogo({ isCollapsed, handleToggleCollapse }: SidebarLogoProps) {
  return (
    <div className="flex items-center p-4 border-b border-cyrela-gray-light">
      {isCollapsed ? (
        <AppLogo variant="icon" className="mx-auto" />
      ) : (
        <AppLogo />
      )}
      
      <button 
        className={cn(
          "ml-auto text-cyrela-gray-dark hover:text-primary",
          !isCollapsed ? "block" : "hidden"
        )}
        onClick={handleToggleCollapse}
      >
        <X size={20} />
      </button>
    </div>
  );
}
