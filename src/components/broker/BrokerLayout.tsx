
import React, { memo, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrokerSidebar } from "@/components/broker/sidebar/broker-sidebar";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
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
  
  // Add periodic session check without causing unnecessary rerenders
  // Only verify that session exists, without redirecting
  usePeriodicSessionCheck(session !== null, location.pathname);

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
