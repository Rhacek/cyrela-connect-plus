
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { SidebarLink } from "./sidebar-link";
import { 
  Home, 
  Calendar, 
  User, 
  Mail, 
  Check, 
  Search, 
  Bell,
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
          >
            <Home className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Imóveis">
          <SidebarLink 
            to="/broker/properties" 
            isActive={currentPath === "/broker/properties"}
          >
            <Home className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Leads">
          <SidebarLink 
            to="/broker/leads" 
            isActive={currentPath === "/broker/leads"}
          >
            <User className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Agenda">
          <SidebarLink 
            to="/broker/schedule" 
            isActive={currentPath === "/broker/schedule"}
          >
            <Calendar className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Compartilhar">
          <SidebarLink 
            to="/broker/share" 
            isActive={currentPath === "/broker/share"}
          >
            <Mail className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Métricas">
          <SidebarLink 
            to="/broker/metrics" 
            isActive={currentPath === "/broker/metrics"}
          >
            <Bell className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Planos">
          <SidebarLink 
            to="/broker/plans" 
            isActive={currentPath === "/broker/plans"}
          >
            <Check className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Meu Perfil">
          <SidebarLink 
            to="/broker/profile" 
            isActive={currentPath === "/broker/profile"}
          >
            <User className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Configurações">
          <SidebarLink 
            to="/broker/settings" 
            isActive={currentPath === "/broker/settings"}
          >
            <Settings className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

// This line is for back-compatibility
export { CollapsedNavLinks as CollapseNavLinks };
