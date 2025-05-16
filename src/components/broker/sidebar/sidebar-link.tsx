
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  icon?: ReactNode;
  label?: string;
  to: string;
  children?: ReactNode;
  isActive?: boolean;
}

export function SidebarLink({ icon, label, to, children, isActive: forcedActive }: SidebarLinkProps) {
  const location = useLocation();
  
  // Check if this link should be active based on the current path
  const checkActive = () => {
    if (forcedActive !== undefined) return forcedActive;
    
    // For exact match
    if (location.pathname === to) return true;
    
    // For nested routes (e.g. /broker/dashboard/something should highlight /broker/dashboard)
    if (to !== '/' && location.pathname.startsWith(to)) return true;
    
    return false;
  };
  
  return (
    <NavLink
      to={to}
      className={({ isActive: navActive }) => 
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-cyrela-gray-lighter",
          (checkActive() || navActive) && "bg-primary text-white hover:bg-primary hover:bg-opacity-90"
        )
      }
      end
    >
      {children || (
        <>
          {icon && <div className="text-lg">{icon}</div>}
          {label && <span className="font-inter">{label}</span>}
        </>
      )}
    </NavLink>
  );
}
