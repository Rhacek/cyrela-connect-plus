
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { BrokerSidebarContent } from "./broker-sidebar-content";

export const BrokerSidebar = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar 
      className={`${isExpanded ? "w-60" : "w-14"} h-screen flex-shrink-0`} 
      side="left"
      collapsible="icon"
    >
      <BrokerSidebarContent />
    </Sidebar>
  );
};
