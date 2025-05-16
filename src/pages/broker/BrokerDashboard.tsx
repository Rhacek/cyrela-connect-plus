
import { useAuth } from "@/context/auth-context";
import { 
  Sidebar, 
  SidebarInset, 
  SidebarProvider
} from "@/components/ui/sidebar";
import { BrokerSidebarContent } from "@/components/broker/sidebar/broker-sidebar-content";
import { DashboardLoading } from "@/components/broker/dashboard/dashboard-loading";
import { DashboardContent } from "@/components/broker/dashboard/dashboard-content";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const BrokerDashboard = () => {
  const { session } = useAuth();
  const { 
    hasInitializedQueries,
    isLoadingPerformance,
    isLoadingTarget,
    isLoadingLeads,
    currentPerformance,
    currentTarget,
    recentLeads,
    handleAddLead
  } = useDashboardData();
  
  // Get user name from session if available
  const userName = session?.user_metadata?.name || "";
  
  // Show a more informative loading state if we're still verifying auth
  if (!hasInitializedQueries && session) {
    return <DashboardLoading />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-cyrela-gray-lightest">
        <Sidebar>
          <BrokerSidebarContent />
        </Sidebar>
        
        <SidebarInset>
          <DashboardContent
            userName={userName}
            performance={currentPerformance}
            target={currentTarget}
            leads={recentLeads}
            isLoadingPerformance={isLoadingPerformance}
            isLoadingTarget={isLoadingTarget}
            isLoadingLeads={isLoadingLeads}
            onAddLead={handleAddLead}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BrokerDashboard;
