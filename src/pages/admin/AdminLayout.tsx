
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { refreshSession } from "@/lib/supabase";

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
        
        // If no session, try to refresh once
        if (!session) {
          console.log("No session in context, attempting refresh");
          const refreshedSession = await refreshSession();
          
          if (!refreshedSession) {
            console.log("Session refresh failed, redirecting to auth");
            redirectToAuth();
            return;
          }
          
          // Wait for the auth context to update with the refreshed session
          setTimeout(() => {
            if (session && isAdmin()) {
              console.log("Admin session verified after refresh");
              setIsVerifying(false);
            } else {
              console.log("Not an admin after refresh, redirecting");
              redirectToAuth();
            }
          }, 1000);
          return;
        }
        
        // If we have a session but not admin, redirect
        if (session && !isAdmin()) {
          console.log("User is not an admin:", session.user_metadata.role);
          toast.error("Acesso administrativo necessário");
          redirectToAuth();
          return;
        }
        
        // If we got here with a session but still verifying, stop verifying
        if (session) {
          setIsVerifying(false);
        } else {
          redirectToAuth();
        }
      } catch (error) {
        console.error("Error in admin session verification:", error);
        redirectToAuth();
      }
    };
    
    verifySession();
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
