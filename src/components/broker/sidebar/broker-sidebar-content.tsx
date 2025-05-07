
import { 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  useSidebar 
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar-logo";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarFooter as BrokerSidebarFooter } from "./sidebar-footer";

export function BrokerSidebarContent() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <>
      <SidebarHeader>
        <SidebarLogo 
          isCollapsed={isCollapsed} 
          handleToggleCollapse={toggleSidebar} 
        />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavigation isCollapsed={isCollapsed} />
      </SidebarContent>
      
      <SidebarFooter>
        <BrokerSidebarFooter 
          isCollapsed={isCollapsed} 
          handleToggleCollapse={toggleSidebar} 
        />
      </SidebarFooter>
    </>
  );
}
