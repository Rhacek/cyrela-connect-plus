
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/auth-context";
import { useSessionCache } from "@/hooks/use-session-cache";
import { toast } from "@/hooks/use-toast";
import { UserSession } from "@/types/auth"; 
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

// Helper function to map Session to UserSession
const mapToUserSession = (session: any): UserSession => {
  if (!session) return null;
  
  return {
    id: session.user?.id,
    email: session.user?.email,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user_metadata: session.user?.user_metadata || {}
  };
};

/**
 * Layout component for the Admin section, includes sidebar, header and outlet
 */
const AdminLayout = () => {
  const { session, loading, initialized, setSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasValidCache, updateSessionCache } = useSessionCache(location.pathname);
  
  // Add the periodic session check to ensure token validity
  usePeriodicSessionCheck(session !== null, location.pathname);
  
  // Check for valid admin session on mount and when location changes
  useEffect(() => {
    // Skip if still loading or no session yet
    if (loading || !initialized) return;
    
    const verifyAdminSession = async () => {
      // If we already have a valid session in the auth context
      if (session && session.user_metadata?.role === UserRole.ADMIN) {
        // Check with Supabase if session is still valid
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.error("Admin session verification failed:", error);
            // Try to refresh the session
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError || !refreshData.session) {
              console.error("Failed to refresh admin session:", refreshError);
              toast.error("Sua sessão expirou. Redirecionando para login...");
              navigate("/auth?redirect=/admin/", { replace: true });
              return;
            }
            
            // Session refreshed, update in context
            const userSession = mapToUserSession(refreshData.session);
            setSession(userSession);
            
            // Ensure it's an admin
            if (userSession.user_metadata?.role !== UserRole.ADMIN) {
              toast.error("Você não tem permissão para acessar esta página");
              navigate("/auth", { replace: true });
            }
          } else {
            // Session is still valid, update cache
            updateSessionCache(session, location.pathname);
          }
        } catch (err) {
          console.error("Error checking admin session:", err);
        }
      } else if (!session) {
        // No session at all, try to restore from Supabase
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (!error && data.session) {
            const userSession = mapToUserSession(data.session);
            
            // Only set the session if it's an admin
            if (userSession.user_metadata?.role === UserRole.ADMIN) {
              setSession(userSession);
              updateSessionCache(userSession, location.pathname);
            } else {
              // Not an admin, redirect
              toast.error("Você não tem permissão para acessar esta página");
              navigate("/auth", { replace: true });
            }
          } else {
            // No valid session found
            navigate("/auth?redirect=/admin/", { replace: true });
          }
        } catch (err) {
          console.error("Error restoring admin session:", err);
        }
      } else if (session && session.user_metadata?.role !== UserRole.ADMIN) {
        // Has session but not an admin
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/auth", { replace: true });
      }
    };
    
    // Verify the admin session if we don't have a valid cache
    if (!hasValidCache) {
      verifyAdminSession();
    }
    
    // Handle path standardization
    const currentPath = location.pathname;
    
    // Only run navigation checks for admin routes
    if (!currentPath.startsWith("/admin")) return;
    
    // Ensure the path ends with a trailing slash unless it's /admin
    if (
      currentPath !== "/admin" && 
      currentPath !== "/admin/" && 
      !currentPath.endsWith("/")
    ) {
      navigate(`${currentPath}/`, { replace: true });
      return;
    }
    
    // Check if this is /admin without trailing slash, standardize to /admin/
    if (currentPath === "/admin") {
      navigate("/admin/", { replace: true });
    }
  }, [location.pathname, hasValidCache, session, navigate, updateSessionCache, loading, initialized, setSession]);

  // Show nothing while checking auth or if not authenticated
  if (loading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-md space-y-4 p-8 bg-white rounded-lg shadow-md">
          <div className="h-8 w-3/4 mx-auto bg-slate-200 animate-pulse rounded"></div>
          <div className="h-32 w-full bg-slate-200 animate-pulse rounded"></div>
          <div className="h-8 w-1/2 mx-auto bg-slate-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }
  
  // Show nothing if not authenticated on admin route
  if (!session && location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-slate-50 overflow-x-hidden w-full">
        <AdminSidebar />
        <div className="flex-1 p-0 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
