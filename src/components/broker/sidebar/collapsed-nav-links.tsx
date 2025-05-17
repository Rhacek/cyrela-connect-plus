
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { SidebarLink } from "./sidebar-link";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar, 
  Share, 
  BarChart2, 
  ListChecks, 
  User, 
  Settings
} from "lucide-react";

interface CollapsedNavLinksProps {
  currentPath?: string;
}

export const CollapsedNavLinks = ({ currentPath }: CollapsedNavLinksProps) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard">
          <SidebarLink 
            to="/broker/dashboard" 
            isActive={currentPath === "/broker/dashboard"}
            className="flex items-center justify-center"
          >
            <LayoutDashboard className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Imóveis">
          <SidebarLink 
            to="/broker/properties" 
            isActive={currentPath === "/broker/properties"}
            className="flex items-center justify-center"
          >
            <Home className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Leads">
          <SidebarLink 
            to="/broker/leads" 
            isActive={currentPath === "/broker/leads"}
            className="flex items-center justify-center"
          >
            <Users className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Agenda">
          <SidebarLink 
            to="/broker/schedule" 
            isActive={currentPath === "/broker/schedule"}
            className="flex items-center justify-center"
          >
            <Calendar className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Compartilhar">
          <SidebarLink 
            to="/broker/share" 
            isActive={currentPath === "/broker/share"}
            className="flex items-center justify-center"
          >
            <Share className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Métricas">
          <SidebarLink 
            to="/broker/metrics" 
            isActive={currentPath === "/broker/metrics"}
            className="flex items-center justify-center"
          >
            <BarChart2 className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Planos">
          <SidebarLink 
            to="/broker/plans" 
            isActive={currentPath === "/broker/plans"}
            className="flex items-center justify-center"
          >
            <ListChecks className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Meu Perfil">
          <SidebarLink 
            to="/broker/profile" 
            isActive={currentPath === "/broker/profile"}
            className="flex items-center justify-center"
          >
            <User className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Configurações">
          <SidebarLink 
            to="/broker/settings" 
            isActive={currentPath === "/broker/settings"}
            className="flex items-center justify-center"
          >
            <Settings className="h-5 w-5" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

// This line is for back-compatibility
export { CollapsedNavLinks as CollapseNavLinks };
