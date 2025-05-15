
import { NavLink } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/ui/app-logo";
import { Bell, Cog, Home, Users, Check, Building } from "lucide-react";

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar className={isExpanded ? "w-60" : "w-14"}>
      <SidebarHeader className="py-4">
        <div className="flex items-center px-4">
          <AppLogo size="sm" />
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin" end className={({ isActive }) => 
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
              }>
                <Home className="h-4 w-4 mr-2" />
                {isExpanded && <span>Dashboard</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/properties" className={({ isActive }) => 
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
              }>
                <Building className="h-4 w-4 mr-2" />
                {isExpanded && <span>Imóveis</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/brokers" className={({ isActive }) => 
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
              }>
                <Users className="h-4 w-4 mr-2" />
                {isExpanded && <span>Corretores</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/plans" className={({ isActive }) => 
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
              }>
                <Check className="h-4 w-4 mr-2" />
                {isExpanded && <span>Planos</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/settings" className={({ isActive }) => 
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
              }>
                <Cog className="h-4 w-4 mr-2" />
                {isExpanded && <span>Configurações</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
