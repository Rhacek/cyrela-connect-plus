
import React, { memo, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrokerSidebar } from "@/components/broker/sidebar/broker-sidebar";
import { useAuth } from "@/context/auth-context";

/**
 * Layout component for the Broker section
 */
const BrokerLayout = memo(() => {
  const { session } = useAuth();
  const location = useLocation();
  const renderCount = useRef(0);
  
  // Increment render count for debugging
  renderCount.current++;
  
  console.log(`BrokerLayout render #${renderCount.current}, path: ${location.pathname}`);
  
  // No session checking or redirection here - this should be handled by ProtectedRoute
  // This component should only render the layout and outlet

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
