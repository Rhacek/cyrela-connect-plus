
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
      <div className="flex min-h-screen bg-slate-50 overflow-x-hidden w-full">
        <BrokerSidebar />
        <main className="flex-1 transition-all duration-300 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default BrokerLayout;
