
import { useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { SidebarLink } from "../broker/sidebar/sidebar-link";
import { 
  Home, 
  Building,
  Users, 
  Check, 
  Settings
} from "lucide-react";

export const ExpandedNavLinks = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/admin/" 
            isActive={currentPath === "/admin/" || currentPath === "/admin"}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/admin/properties/" 
            isActive={currentPath.startsWith("/admin/properties")}
          >
            <Building className="h-4 w-4" />
            <span>Imóveis</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/admin/brokers/" 
            isActive={currentPath.startsWith("/admin/brokers")}
          >
            <Users className="h-4 w-4" />
            <span>Corretores</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/admin/plans/" 
            isActive={currentPath.startsWith("/admin/plans")}
          >
            <Check className="h-4 w-4" />
            <span>Planos</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/admin/settings/" 
            isActive={currentPath.startsWith("/admin/settings")}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
