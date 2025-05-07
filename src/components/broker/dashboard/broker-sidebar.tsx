
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarLogo } from "../sidebar/sidebar-logo";
import { SidebarNavigation } from "../sidebar/sidebar-navigation";
import { SidebarFooter } from "../sidebar/sidebar-footer";

interface BrokerSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export function BrokerSidebar({ collapsed = false, setCollapsed }: BrokerSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  useEffect(() => {
    if (collapsed !== undefined && collapsed !== isCollapsed) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed]);

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (setCollapsed) {
      setCollapsed(newState);
    }
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-cyrela-gray-light transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <SidebarLogo 
        isCollapsed={isCollapsed}
        handleToggleCollapse={handleToggleCollapse}
      />
      
      <SidebarNavigation isCollapsed={isCollapsed} />
      
      <SidebarFooter 
        isCollapsed={isCollapsed}
        handleToggleCollapse={handleToggleCollapse}
      />
    </aside>
  );
}
