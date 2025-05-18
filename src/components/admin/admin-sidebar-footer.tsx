
import { LogOut, User, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarLink } from "../broker/sidebar/sidebar-link";
import { useAuth } from "@/context/auth-context";
import { signOutAndCleanup } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AdminSidebarFooterProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

export function AdminSidebarFooter({ isCollapsed, handleToggleCollapse }: AdminSidebarFooterProps) {
  const { setSession, session } = useAuth();
  const navigate = useNavigate();
  
  // Extract user information from session
  const userName = session?.user_metadata?.name || "Administrador";
  const userRole = "Administrador";
  
  const handleLogout = async () => {
    try {
      console.log("Starting sign out process");
      
      // First clear session in the auth context to prevent redirection issues
      setSession(null);
      
      // Then perform Supabase signout using the centralized helper
      const { success, error } = await signOutAndCleanup();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Erro ao sair', {
          description: error.message,
        });
        return;
      }
      
      toast.success('Você saiu com sucesso');
      
      // Force redirect to login page
      console.log("Sign out successful, redirecting to login page");
      navigate("/auth", { replace: true });
      
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao sair');
    }
  };
  
  return (
    <div className="p-4 border-t border-cyrela-gray-light transition-all duration-300">
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
            <p className="font-medium text-sm font-poppins truncate max-w-[140px]">{userName}</p>
            <p className="text-xs text-cyrela-gray-dark font-inter truncate max-w-[140px]">{userRole}</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 transition-all duration-300">
        {isCollapsed ? (
          <div className="flex justify-center">
            <a href="/admin/settings/" className="flex items-center justify-center p-3 hover:bg-cyrela-gray-lighter rounded-full w-10 h-10">
              <Settings size={20} className="text-cyrela-gray-dark transition-all duration-300" />
            </a>
          </div>
        ) : (
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Configurações" 
            to="/admin/settings/" 
          />
        )}
      </div>
      
      {/* Logout button */}
      <div className="mt-4 transition-all duration-300">
        {isCollapsed ? (
          <div className="flex justify-center">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center p-3 hover:bg-cyrela-gray-lighter rounded-full w-10 h-10 text-cyrela-gray-dark"
            >
              <LogOut size={20} className="transition-all duration-300" />
            </button>
          </div>
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
      
      <div className="mt-4 transition-all duration-300">
        <button
          onClick={handleToggleCollapse}
          className={cn(
            "flex items-center justify-center w-full py-2 text-sm text-cyrela-gray-dark hover:text-primary font-inter transition-all duration-300",
            isCollapsed && "px-0"
          )}
        >
          {isCollapsed ? (
            <Menu size={20} className="transition-all duration-300" />
          ) : (
            <span>Recolher</span>
          )}
        </button>
      </div>
    </div>
  );
}
