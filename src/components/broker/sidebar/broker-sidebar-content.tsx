
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar-logo";
import { CollapsedNavLinks } from "./collapsed-nav-links";
import { ExpandedNavLinks } from "./expanded-nav-links";
import { SidebarFooterContent } from "./sidebar-footer";

export const BrokerSidebarContent = () => {
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
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isExpanded ? 
          <ExpandedNavLinks /> : 
          <CollapsedNavLinks />
        }
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent 
          isCollapsed={isCollapsed} 
          handleToggleCollapse={toggleSidebar} 
        />
      </SidebarFooter>
    </>
  );
};
