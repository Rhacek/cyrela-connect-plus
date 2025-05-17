
import { LogOut, User, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarLink } from "./sidebar-link";
import { useAuth } from "@/context/auth-context";

interface SidebarFooterProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

export function SidebarFooter({ isCollapsed, handleToggleCollapse }: SidebarFooterProps) {
  const { signOut, session } = useAuth();
  
  // Extract user information from session
  const userName = session?.user_metadata?.name || "Não informado";
  const userRole = session?.user_metadata?.role === "ADMIN" ? "Administrador" : "Corretor PRO";
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="p-4 border-t border-cyrela-gray-light">
      {!isCollapsed && (
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-cyrela-gray-lighter flex items-center justify-center">
            {session?.user_metadata?.profile_image ? (
              <img 
                src={session.user_metadata.profile_image} 
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-cyrela-gray-dark" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm font-poppins">{userName}</p>
            <p className="text-xs text-cyrela-gray-dark font-inter">{userRole}</p>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        {isCollapsed ? (
          <a href="/settings" className="block p-3 hover:bg-cyrela-gray-lighter rounded-full mx-auto w-fit">
            <Settings size={20} className="text-cyrela-gray-dark" />
          </a>
        ) : (
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Configurações" 
            to="/settings" 
          />
        )}
      </div>
      
      {/* Logout button */}
      <div className="mt-4">
        {isCollapsed ? (
          <button 
            onClick={handleLogout}
            className="block p-3 hover:bg-cyrela-gray-lighter rounded-full mx-auto w-fit text-cyrela-gray-dark"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-cyrela-gray-dark hover:bg-cyrela-gray-lighter rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <button
          onClick={handleToggleCollapse}
          className={cn(
            "flex items-center justify-center w-full py-2 text-sm text-cyrela-gray-dark hover:text-primary font-inter",
            isCollapsed ? "mx-auto" : ""
          )}
        >
          {isCollapsed ? (
            <Menu size={20} />
          ) : (
            <span>Recolher</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Also export a footer content component for compatibility
export const SidebarFooterContent = SidebarFooter;
