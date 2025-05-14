
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarLink } from "./sidebar-link";
import { Home, Calendar, User, Mail, Check, Search, Bell } from "lucide-react";

export const ExpandedNavLinks = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/dashboard">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/properties">
            <Home className="h-4 w-4" />
            <span>Imóveis</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/leads">
            <User className="h-4 w-4" />
            <span>Leads</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/schedule">
            <Calendar className="h-4 w-4" />
            <span>Agenda</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/share">
            <Mail className="h-4 w-4" />
            <span>Compartilhar</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/metrics">
            <Bell className="h-4 w-4" />
            <span>Métricas</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/plans">
            <Check className="h-4 w-4" />
            <span>Planos</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <SidebarLink to="/broker/profile">
            <User className="h-4 w-4" />
            <span>Meu Perfil</span>
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
