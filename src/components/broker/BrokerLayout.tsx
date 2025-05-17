
import React, { memo, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrokerSidebar } from "@/components/broker/sidebar/broker-sidebar";
import { useAuth } from "@/context/auth-context";

/**
 * Layout component for the Broker section
 */
const BrokerLayout = memo(() => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  
  const isBrokerRoute = pathname.startsWith("/broker");
  
  // Only redirect from the root broker path to dashboard
  useEffect(() => {
    if (!loading) {
      // Redirect to auth if no session and on broker route
      if (!session && isBrokerRoute) {
        navigate("/auth", { replace: true });
      }
      
      // Only redirect to dashboard if exactly at /broker path
      if (session && pathname === "/broker") {
        navigate("/broker/dashboard", { replace: true });
      }
    }
  }, [session, pathname, navigate, loading, isBrokerRoute]);
  
  // Show nothing while checking auth
  if (loading) {
    return null;
  }
  
  // Show nothing if not authenticated on broker route
  if (!session && isBrokerRoute) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-slate-50 overflow-x-hidden w-full">
        <BrokerSidebar />
        <div className="flex-1 p-0 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
});

BrokerLayout.displayName = "BrokerLayout";

export default BrokerLayout;
