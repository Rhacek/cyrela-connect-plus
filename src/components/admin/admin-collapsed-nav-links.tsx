
import { useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { SidebarLink } from "../broker/sidebar/sidebar-link";
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Check, 
  Settings
} from "lucide-react";

export const CollapsedNavLinks = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard">
          <SidebarLink 
            to="/admin/" 
            isActive={currentPath === "/admin/" || currentPath === "/admin"}
            className="flex items-center justify-center"
          >
            <LayoutDashboard className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Imóveis">
          <SidebarLink 
            to="/admin/properties/" 
            isActive={currentPath.startsWith("/admin/properties")}
            className="flex items-center justify-center"
          >
            <Building className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Corretores">
          <SidebarLink 
            to="/admin/brokers/" 
            isActive={currentPath.startsWith("/admin/brokers")}
            className="flex items-center justify-center"
          >
            <Users className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Planos">
          <SidebarLink 
            to="/admin/plans/" 
            isActive={currentPath.startsWith("/admin/plans")}
            className="flex items-center justify-center"
          >
            <Check className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Configurações">
          <SidebarLink 
            to="/admin/settings/" 
            isActive={currentPath.startsWith("/admin/settings")}
            className="flex items-center justify-center"
          >
            <Settings className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
