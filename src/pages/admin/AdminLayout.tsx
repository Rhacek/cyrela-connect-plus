
import { useEffect } from "react";
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
    
    // Verify the session directly with Supabase
    const verifySessionWithSupabase = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Direct Supabase session check in AdminLayout:", {
          hasSession: !!data.session,
          sessionId: data.session?.user?.id,
          userRole: data.session?.user?.user_metadata?.role
        });
        
        // If no session or not admin, redirect
        if (!data.session || data.session.user.user_metadata.role !== UserRole.ADMIN) {
          console.log("Invalid admin session detected in AdminLayout, redirecting");
          toast.error("Acesso administrativo necessário");
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Error verifying admin session:", error);
        navigate("/auth", { replace: true });
      }
    };
    
    verifySessionWithSupabase();
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
