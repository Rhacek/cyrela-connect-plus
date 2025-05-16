
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase, verifyAdminAccess } from "@/utils/auth-redirect";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  
  // Verify admin access whenever this component mounts
  useEffect(() => {
    console.log("AdminLayout mounted, checking admin session:", {
      hasSession: !!session,
      sessionId: session?.id,
      userMetadata: session?.user_metadata,
      userRole: session?.user_metadata?.role,
      isAdmin: isAdmin()
    });
    
    // Double verification process for admin access
    const verifySession = async () => {
      try {
        // First, check context session
        if (session && isAdmin()) {
          console.log("Admin session verified from context");
          return;
        }
        
        // If context check fails, verify directly with Supabase
        const hasAdminAccess = await verifyAdminAccess();
        
        if (!hasAdminAccess) {
          console.log("No valid admin session found, redirecting to auth");
          toast.error("Acesso administrativo necessário");
          navigate("/auth?redirect=/admin/", { replace: true });
        }
      } catch (error) {
        console.error("Error in admin session verification:", error);
        navigate("/auth?redirect=/admin/", { replace: true });
      }
    };
    
    verifySession();
    
    // Set up a periodic verification for long admin sessions
    const intervalId = setInterval(verifySession, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, session, isAdmin]);
  
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
