
import { memo } from "react";
import { 
  Sidebar, 
  SidebarContent,
  useSidebar
} from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./admin-sidebar-content";

export const AdminSidebar = memo(() => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar 
      className={`h-screen flex-shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out z-10 ${isExpanded ? "w-64" : "w-16"}`} 
      side="left"
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        <AdminSidebarContent />
      </SidebarContent>
    </Sidebar>
  );
});

AdminSidebar.displayName = "AdminSidebar";
