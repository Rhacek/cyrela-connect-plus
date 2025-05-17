
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  icon?: ReactNode;
  label?: string;
  to: string;
  children?: ReactNode;
  isActive?: boolean;
  className?: string;
}

export function SidebarLink({ 
  icon, 
  label, 
  to, 
  children, 
  isActive: forcedActive,
  className 
}: SidebarLinkProps) {
  const location = useLocation();
  
  // Check if this link should be active based on the current path
  const checkActive = () => {
    // If we have a forced active state, use that
    if (forcedActive !== undefined) return forcedActive;
    
    // For exact match
    if (location.pathname === to) return true;
    
    // For nested routes (e.g. /broker/dashboard/something should highlight /broker/dashboard)
    // But make sure we don't match partial path segments
    if (to !== '/' && to !== '/auth') {
      const pathSegments = location.pathname.split('/');
      const linkSegments = to.split('/');
      
      // Check if all segments in the link path match the corresponding segments in the current path
      let isMatch = true;
      for (let i = 0; i < linkSegments.length; i++) {
        if (linkSegments[i] !== pathSegments[i]) {
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) return true;
    }
    
    return false;
  };
  
  // Use our own active check and the NavLink's isActive
  return (
    <NavLink
      to={to}
      className={({ isActive: navActive }) => 
        cn(
          "transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-md hover:bg-cyrela-gray-lighter",
          (checkActive() || navActive) && "bg-primary text-white hover:bg-primary hover:bg-opacity-90",
          className
        )
      }
      end
    >
      {children || (
        <>
          {icon && <div className="text-lg transition-all duration-300">{icon}</div>}
          {label && <span className="font-inter transition-all duration-300">{label}</span>}
        </>
      )}
    </NavLink>
  );
}
