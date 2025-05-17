
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
      className={`h-screen flex-shrink-0 border-r border-slate-200 bg-white transition-all duration-300 z-10 ${isExpanded ? "w-64" : "w-16"}`} 
      side="left"
      collapsible="icon"
    >
      <BrokerSidebarContent />
    </Sidebar>
  );
};
