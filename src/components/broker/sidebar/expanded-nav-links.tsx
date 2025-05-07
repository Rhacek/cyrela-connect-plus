
import { 
  Home, 
  User, 
  Building, 
  Users, 
  Calendar, 
  BarChart, 
  Share
} from "lucide-react";
import { SidebarLink } from "./sidebar-link";

export function ExpandedNavLinks() {
  return (
    <>
      <SidebarLink 
        icon={<Home />} 
        label="Dashboard" 
        href="/broker/dashboard" 
        isActive={true}
      />
      <SidebarLink 
        icon={<User />} 
        label="Meu perfil" 
        href="/broker/profile" 
      />
      <SidebarLink 
        icon={<Building />} 
        label="Imóveis" 
        href="/broker/properties" 
      />
      <SidebarLink 
        icon={<Users />} 
        label="Leads" 
        href="/broker/leads" 
      />
      <SidebarLink 
        icon={<Calendar />} 
        label="Agenda" 
        href="/broker/schedule" 
      />
      <SidebarLink 
        icon={<BarChart />} 
        label="Desempenho" 
        href="/broker/metrics" 
      />
      <SidebarLink 
        icon={<Share />} 
        label="Compartilhar" 
        href="/broker/share" 
      />
    </>
  );
}
