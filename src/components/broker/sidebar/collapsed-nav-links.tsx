
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarLink } from "./sidebar-link";
import { Home, Calendar, User, Mail, Check, Search, Bell } from "lucide-react";

export const CollapseNavLinks = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard">
          <SidebarLink to="/broker/dashboard">
            <Home className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Imóveis">
          <SidebarLink to="/broker/properties">
            <Home className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Leads">
          <SidebarLink to="/broker/leads">
            <User className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Agenda">
          <SidebarLink to="/broker/schedule">
            <Calendar className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Compartilhar">
          <SidebarLink to="/broker/share">
            <Mail className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Métricas">
          <SidebarLink to="/broker/metrics">
            <Bell className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Planos">
          <SidebarLink to="/broker/plans">
            <Check className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Meu Perfil">
          <SidebarLink to="/broker/profile">
            <User className="h-4 w-4" />
          </SidebarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
