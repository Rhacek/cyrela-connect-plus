
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./admin-sidebar-logo";
import { CollapsedNavLinks } from "./admin-collapsed-nav-links";
import { ExpandedNavLinks } from "./admin-expanded-nav-links";
import { AdminSidebarFooter } from "./admin-sidebar-footer";

export const AdminSidebarContent = () => {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";
  const isCollapsed = !isExpanded;

  return (
    <>
      <SidebarHeader className="py-4">
        <div className="flex items-center px-4">
          <SidebarLogo 
            isCollapsed={isCollapsed} 
            handleToggleCollapse={toggleSidebar} 
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isExpanded ? 
          <ExpandedNavLinks /> : 
          <CollapsedNavLinks />
        }
      </SidebarContent>
      <SidebarFooter>
        <AdminSidebarFooter 
          isCollapsed={isCollapsed} 
          handleToggleCollapse={toggleSidebar} 
        />
      </SidebarFooter>
    </>
  );
};
