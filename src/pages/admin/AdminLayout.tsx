
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/auth-context";
import { useSessionCache } from "@/hooks/use-session-cache";
import { toast } from "@/hooks/use-toast";
import { UserSession } from "@/types/auth"; // Fixed import path from @/types/auth

// Helper function to map Session to UserSession
const mapToUserSession = (session: any): UserSession => {
  if (!session) return null;
  
  return {
    id: session.id,
    email: session.email || session.user?.email,
    expires_at: session.expires_at, // Include expires_at property
    user_metadata: session.user_metadata || session.user?.user_metadata || {}
  };
};

/**
 * Layout component for the Admin section, includes sidebar, header and outlet
 */
const AdminLayout = () => {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasValidCache, updateSessionCache } = useSessionCache(location.pathname);
  
  // Effect to handle path verification and route adjustments
  useEffect(() => {
    // Extract current path without query params
    const currentPath = location.pathname;
    
    // Only run navigation checks for admin routes
    if (!currentPath.startsWith("/admin")) return;
    
    console.log(`AdminLayout - Path check for ${currentPath}`);
    
    // Check if we have a valid cache for this route
    if (hasValidCache) {
      console.log(`AdminLayout - Using cached session for ${currentPath}`);
      return;
    }
    
    // Ensure the path ends with a trailing slash unless it's /admin
    // This is to standardize all admin routes
    if (
      currentPath !== "/admin" && 
      currentPath !== "/admin/" && 
      !currentPath.endsWith("/")
    ) {
      console.log(`AdminLayout - Redirecting to path with trailing slash: ${currentPath}/`);
      navigate(`${currentPath}/`, { replace: true });
      return;
    }
    
    // Check if this is /admin without trailing slash, standardize to /admin/
    if (currentPath === "/admin") {
      console.log(`AdminLayout - Redirecting /admin to /admin/`);
      navigate("/admin/", { replace: true });
      return;
    }
    
    // If we have a session and it's verified
    if (session) {
      // Update session cache to avoid future checks on this path
      const userRole = session.user_metadata?.role;
      
      if (userRole === "ADMIN") {
        console.log(`AdminLayout - Path ${currentPath} already verified, caching`);
        updateSessionCache(mapToUserSession(session), currentPath);
      } else {
        // If user is not an admin, redirect to appropriate dashboard
        console.log(`AdminLayout - User is ${userRole}, not ADMIN, redirecting`);
        toast.error("Você não tem permissão para acessar esta página");
        
        if (userRole === "BROKER") {
          navigate("/broker/dashboard/", { replace: true });
        } else if (userRole === "CLIENT") {
          navigate("/client/welcome/", { replace: true });
        } else {
          navigate("/auth", { replace: true });
        }
      }
    }
  }, [location.pathname, hasValidCache, session, navigate, updateSessionCache]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
