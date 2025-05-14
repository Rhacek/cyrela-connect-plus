
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  icon?: ReactNode;
  label?: string;
  href: string;
  to: string;
  children?: ReactNode;
  isActive?: boolean;
}

export function SidebarLink({ icon, label, to, children, isActive }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive: active }) => 
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-cyrela-gray-lighter",
          (isActive || active) && "bg-primary text-white hover:bg-primary hover:bg-opacity-90"
        )
      }
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
