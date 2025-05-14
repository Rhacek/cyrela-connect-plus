
import { CollapseNavLinks } from "./collapsed-nav-links";
import { ExpandedNavLinks } from "./expanded-nav-links";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar-logo";
import { SidebarFooterContent } from "./sidebar-footer";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const BrokerSidebarContent = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <>
      <SidebarHeader className="py-4">
        <div className="flex items-center px-4">
          <SidebarLogo />
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isExpanded ? <ExpandedNavLinks /> : <CollapseNavLinks />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </>
  );
};
