
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { session, isAdmin, initialized } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Simplified session verification with better error handling
  useEffect(() => {
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
    
    // If not admin or no session, redirect
    if (!session || !isAdmin()) {
      console.log("User is not an admin or not logged in:", session?.user_metadata?.role);
      toast.error("Acesso administrativo necessário");
      redirectToAuth();
    }
  }, [navigate, session, isAdmin, initialized]);
  
  // Helper function to ensure consistent redirect with parameters
  const redirectToAuth = () => {
    toast.error("Acesso administrativo necessário");
    navigate("/auth?redirect=/admin/", { replace: true });
  };
  
  // Show loading state while verifying session
  if (isVerifying && !initialized) {
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
