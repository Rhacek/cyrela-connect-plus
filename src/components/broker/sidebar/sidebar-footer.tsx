
import { User, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarLink } from "./sidebar-link";

interface SidebarFooterProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

export function SidebarFooter({ isCollapsed, handleToggleCollapse }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-cyrela-gray-light">
      {!isCollapsed && (
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-cyrela-gray-lighter flex items-center justify-center">
            <User size={20} className="text-cyrela-gray-dark" />
          </div>
          <div>
            <p className="font-medium text-sm font-poppins">Ana Silva</p>
            <p className="text-xs text-cyrela-gray-dark font-inter">Corretor PRO</p>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        {isCollapsed ? (
          <a href="/settings" className="block p-3 hover:bg-cyrela-gray-lighter rounded-full mx-auto w-fit">
            <Settings size={20} className="text-cyrela-gray-dark" />
          </a>
        ) : (
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Configurações" 
            to="/settings" 
          />
        )}
      </div>
      
      <div className="mt-4">
        <button
          onClick={handleToggleCollapse}
          className={cn(
            "flex items-center justify-center w-full py-2 text-sm text-cyrela-gray-dark hover:text-primary font-inter",
            isCollapsed ? "mx-auto" : ""
          )}
        >
          {isCollapsed ? (
            <Menu size={20} />
          ) : (
            <span>Recolher</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Also export a footer content component for compatibility
export const SidebarFooterContent = SidebarFooter;
