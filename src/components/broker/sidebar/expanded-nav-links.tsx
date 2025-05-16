
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

interface ExpandedNavLinksProps {
  currentPath?: string;
}

export const ExpandedNavLinks = ({ currentPath }: ExpandedNavLinksProps) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/dashboard" 
            isActive={currentPath === "/broker/dashboard"}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/properties" 
            isActive={currentPath === "/broker/properties"}
          >
            <Home className="h-4 w-4" />
            <span>Imóveis</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/leads" 
            isActive={currentPath === "/broker/leads"}
          >
            <User className="h-4 w-4" />
            <span>Leads</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/schedule" 
            isActive={currentPath === "/broker/schedule"}
          >
            <Calendar className="h-4 w-4" />
            <span>Agenda</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/share" 
            isActive={currentPath === "/broker/share"}
          >
            <Mail className="h-4 w-4" />
            <span>Compartilhar</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/metrics" 
            isActive={currentPath === "/broker/metrics"}
          >
            <Bell className="h-4 w-4" />
            <span>Métricas</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/plans" 
            isActive={currentPath === "/broker/plans"}
          >
            <Check className="h-4 w-4" />
            <span>Planos</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/profile" 
            isActive={currentPath === "/broker/profile"}
          >
            <User className="h-4 w-4" />
            <span>Meu Perfil</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink 
            to="/broker/settings" 
            isActive={currentPath === "/broker/settings"}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
