
import { CollapsedNavLinks } from "./collapsed-nav-links";
import { ExpandedNavLinks } from "./expanded-nav-links";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

export function SidebarNavigation({ isCollapsed }: SidebarNavigationProps) {
  return (
    <div className="flex-1 py-6 overflow-y-auto">
      <div className="space-y-1 px-3">
        {isCollapsed ? <CollapsedNavLinks /> : <ExpandedNavLinks />}
      </div>
    </div>
  );
}
