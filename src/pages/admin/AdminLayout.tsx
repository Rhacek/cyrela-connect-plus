
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { refreshSession } from "@/integrations/supabase/client";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { session, isAdmin, initialized } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  
  // Improved session verification with fallback to session refresh
  useEffect(() => {
    let isMounted = true;
    
    const verifyAdminSession = async () => {
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
        initialized
      });
      
      // First, check if we have a valid admin session in context
      if (session && isAdmin()) {
        console.log("Admin session verified from context");
        if (isMounted) setIsVerifying(false);
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
            // The auth context should be updated via listeners, we just wait for rerender
            if (isMounted) {
              setIsRefreshingSession(false);
              // Don't set isVerifying false yet, let the updated session trigger rerender
            }
            return;
          }
        } catch (err) {
          console.error("Error refreshing session:", err);
        }
        
        if (isMounted) {
          setIsRefreshingSession(false);
          console.log("User is not an admin or not logged in");
          toast.error("Acesso administrativo necessário");
          redirectToAuth();
        }
      } else if (isMounted) {
        setIsVerifying(false);
      }
    };
    
    verifyAdminSession();
    
    return () => {
      isMounted = false;
    };
  }, [navigate, session, isAdmin, initialized, isRefreshingSession]);
  
  // Helper function to ensure consistent redirect with parameters
  const redirectToAuth = () => {
    toast.error("Acesso administrativo necessário");
    navigate("/auth?redirect=/admin/", { replace: true });
  };
  
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
