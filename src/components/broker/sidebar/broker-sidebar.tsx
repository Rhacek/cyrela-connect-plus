
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { BrokerSidebarContent } from "./broker-sidebar-content";

export const BrokerSidebar = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar className={isExpanded ? "w-60" : "w-14"}>
      <BrokerSidebarContent />
    </Sidebar>
  );
};
