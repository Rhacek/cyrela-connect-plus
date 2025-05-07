
import { useLocation } from "react-router-dom";
import { CollapsedNavLinks } from "./collapsed-nav-links";
import { ExpandedNavLinks } from "./expanded-nav-links";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

export function SidebarNavigation({ isCollapsed }: SidebarNavigationProps) {
  const { pathname } = useLocation();
  
  return (
    <div className="flex-1 py-6 overflow-y-auto">
      <div className="space-y-1 px-3">
        {isCollapsed ? 
          <CollapsedNavLinks currentPath={pathname} /> : 
          <ExpandedNavLinks currentPath={pathname} />
        }
      </div>
    </div>
  );
}
