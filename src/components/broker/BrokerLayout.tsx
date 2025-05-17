
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrokerSidebar } from "@/components/broker/sidebar/broker-sidebar";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "react-router-dom";

/**
 * Layout component for the Broker section
 */
const BrokerLayout = () => {
  const { session } = useAuth();
  const location = useLocation();
  
  // Add periodic session check
  usePeriodicSessionCheck(session !== null, location.pathname);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden">
        <BrokerSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default BrokerLayout;
