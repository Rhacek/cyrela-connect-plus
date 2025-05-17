
import React, { memo, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrokerSidebar } from "@/components/broker/sidebar/broker-sidebar";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar/sidebar-inset";

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
  
  // Add periodic session check without causing unnecessary rerenders
  usePeriodicSessionCheck(session !== null, location.pathname);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-slate-50 overflow-x-hidden w-full">
        <BrokerSidebar />
        <SidebarInset className="p-0 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
            <Outlet />
          </div>
        </SidebarInset>
        <Toaster />
      </div>
    </SidebarProvider>
  );
});

BrokerLayout.displayName = "BrokerLayout";

export default BrokerLayout;
