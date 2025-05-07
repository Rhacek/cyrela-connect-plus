
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

interface ExpandedNavLinksProps {
  currentPath: string;
}

export function ExpandedNavLinks({ currentPath }: ExpandedNavLinksProps) {
  const routes = [
    { path: "/broker/dashboard", label: "Dashboard", icon: <Home /> },
    { path: "/broker/profile", label: "Meu perfil", icon: <User /> },
    { path: "/broker/properties", label: "Imóveis", icon: <Building /> },
    { path: "/broker/leads", label: "Leads", icon: <Users /> },
    { path: "/broker/schedule", label: "Agenda", icon: <Calendar /> },
    { path: "/broker/metrics", label: "Desempenho", icon: <BarChart /> },
    { path: "/broker/share", label: "Compartilhar", icon: <Share /> }
  ];

  return (
    <>
      {routes.map((route) => (
        <SidebarLink 
          key={route.path}
          icon={route.icon} 
          label={route.label} 
          href={route.path}
          isActive={currentPath === route.path}
        />
      ))}
    </>
  );
}
