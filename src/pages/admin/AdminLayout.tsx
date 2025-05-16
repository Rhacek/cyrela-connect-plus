
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { session, isAdmin, initialized } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Improved session verification with better error handling
  useEffect(() => {
    const verifySession = async () => {
      try {
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
          setIsVerifying(false);
          return;
        }
        
        // If not, verify directly with Supabase
        console.log("Verifying admin session directly with Supabase");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting Supabase session:", error);
          redirectToAuth();
          return;
        }
        
        if (!data.session) {
          console.log("No valid session found in Supabase");
          redirectToAuth();
          return;
        }
        
        // Check if the user has admin role
        const userRole = data.session.user.user_metadata?.role;
        if (userRole !== UserRole.ADMIN) {
          console.log("User is not an admin:", userRole);
          toast.error("Acesso administrativo necessário");
          redirectToAuth();
          return;
        }
        
        // Try to refresh the session token
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing session:", refreshError);
            // If refresh fails, we'll still proceed with the original session if it's valid
          } else if (refreshData.session) {
            console.log("Session refreshed successfully");
            // The session listener should handle this refreshed session
          }
        } catch (refreshErr) {
          console.error("Error during session refresh:", refreshErr);
        }
        
        // If we got here, we have a valid admin session
        console.log("Admin session verified with Supabase");
        setIsVerifying(false);
      } catch (error) {
        console.error("Error in admin session verification:", error);
        redirectToAuth();
      }
    };
    
    verifySession();
    
    // Set up periodic verification for long admin sessions (every 5 minutes)
    const intervalId = setInterval(verifySession, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, session, isAdmin, initialized]);
  
  // Helper function to ensure consistent redirect with parameters
  const redirectToAuth = () => {
    toast.error("Acesso administrativo necessário");
    navigate("/auth?redirect=/admin/", { replace: true });
  };
  
  // Show loading state while verifying session
  if (isVerifying) {
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
