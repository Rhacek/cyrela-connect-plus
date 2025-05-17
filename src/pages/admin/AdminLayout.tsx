
import { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { refreshSession } from "@/lib/supabase";
import { useSessionCache } from "@/hooks/use-session-cache";
import { debounce } from "@/lib/utils";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAdmin, initialized } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const [verifiedPath, setVerifiedPath] = useState("");
  const { hasValidCache, updateSessionCache, cachedSession } = useSessionCache(location.pathname);
  
  // Create a stable route ID for the current path
  const currentRouteId = location.pathname.replace(/\/$/, "");
  
  // Create a debounced redirect function to avoid multiple redirects
  const debouncedRedirect = useCallback(
    debounce((path: string) => {
      console.log(`AdminLayout: Debounced redirect to ${path}`);
      navigate(path, { replace: true });
    }, 800),
    [navigate]
  );
  
  // Improved session verification with fallback to session refresh
  useEffect(() => {
    let isMounted = true;
    
    // Skip verification if this path was already verified
    if (verifiedPath === currentRouteId) {
      console.log(`AdminLayout - Path ${currentRouteId} already verified, skipping`);
      if (isMounted && isVerifying) setIsVerifying(false);
      return;
    }
    
    // Use cached session if available
    if (hasValidCache && cachedSession) {
      console.log(`AdminLayout - Using cached session for ${location.pathname}`);
      if (isMounted && isVerifying) setIsVerifying(false);
      setVerifiedPath(currentRouteId);
      return;
    }
    
    const verifyAdminSession = async () => {
      // Skip if we're refreshing or path was verified
      if (isRefreshingSession || !isMounted) return;
      
      // Wait for auth context to initialize first
      if (!initialized) {
        console.log("Auth context not initialized yet, waiting...");
        return;
      }
      
      console.log("AdminLayout - Verifying admin session:", {
        hasSession: !!session,
        sessionId: session?.id,
        userMetadata: session?.user_metadata,
        userRole: session?.user_metadata?.role,
        isAdmin: isAdmin(),
        initialized,
        path: location.pathname
      });
      
      // First, check if we have a valid admin session in context
      if (session && isAdmin()) {
        console.log("Admin session verified from context");
        if (isMounted) {
          setIsVerifying(false);
          setVerifiedPath(currentRouteId);
          updateSessionCache(session, location.pathname);
        }
        return;
      }
      
      // Try refreshing the session if not found or not admin
      if ((!session || !isAdmin()) && !isRefreshingSession) {
        if (isMounted) setIsRefreshingSession(true);
        
        console.log("No valid admin session, attempting to refresh...");
        try {
          const refreshedSession = await refreshSession();
          
          if (refreshedSession && refreshedSession.user.user_metadata?.role === 'ADMIN') {
            console.log("Successfully refreshed admin session");
            
            if (isMounted) {
              setIsRefreshingSession(false);
              setIsVerifying(false);
              setVerifiedPath(currentRouteId);
              updateSessionCache(refreshedSession, location.pathname);
            }
            return;
          }
          
          if (isMounted) setIsRefreshingSession(false);
        } catch (err) {
          console.error("Error refreshing session:", err);
          if (isMounted) setIsRefreshingSession(false);
        }
        
        if (isMounted) {
          console.log("User is not an admin or not logged in");
          toast.error("Acesso administrativo necessário");
          debouncedRedirect("/auth?redirect=/admin/");
        }
      } else if (isMounted) {
        setIsVerifying(false);
      }
    };
    
    // Trigger verification with a small delay
    const verificationTimer = setTimeout(() => {
      verifyAdminSession();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(verificationTimer);
    };
  }, [
    navigate, 
    session, 
    isAdmin, 
    initialized, 
    isRefreshingSession, 
    location.pathname, 
    verifiedPath, 
    currentRouteId,
    hasValidCache,
    cachedSession,
    updateSessionCache,
    debouncedRedirect
  ]);
  
  // Show loading state while verifying session
  if ((isVerifying || !initialized) && !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando acesso administrativo...</p>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex overflow-x-hidden w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
};

export default AdminLayout;
