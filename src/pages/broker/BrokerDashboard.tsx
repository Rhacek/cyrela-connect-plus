
import { DashboardContent } from "@/components/broker/dashboard/dashboard-content";
import { DashboardLoading } from "@/components/broker/dashboard/dashboard-loading";
import { useAuth } from "@/context/auth-context";
import { useTargetData } from "@/hooks/dashboard/use-target-data";
import { usePerformanceData } from "@/hooks/dashboard/use-performance-data";
import { useLeadsData } from "@/hooks/dashboard/use-leads-data";
import { useState } from "react";
import { CreateLeadDialog } from "@/components/broker/leads/create-lead-dialog";

export default function BrokerDashboard() {
  const { session } = useAuth();
  const brokerId = session?.id;
  const sessionEnabled = !!session;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch data from Supabase
  const { currentTarget, isLoadingTarget } = useTargetData(brokerId, sessionEnabled);
  const { 
    currentPerformance, 
    isLoadingPerformance, 
    refreshAllMetrics 
  } = usePerformanceData(brokerId, sessionEnabled);
  const { recentLeads, isLoadingLeads, refetchLeads } = useLeadsData(brokerId, sessionEnabled);

  // Show loading state if any data is still loading
  if (isLoadingTarget || isLoadingPerformance || isLoadingLeads) {
    return <DashboardLoading />;
  }

  const handleAddLead = () => {
    setIsCreateDialogOpen(true);
  };

  const handleLeadCreated = () => {
    // Refresh all metrics and lead data when a new lead is created
    refreshAllMetrics();
    refetchLeads();
  };

  return (
    <>
      <DashboardContent
        userName={session?.user_metadata?.name || ""}
        performance={currentPerformance}
        target={currentTarget}
        leads={recentLeads}
        isLoadingPerformance={isLoadingPerformance}
        isLoadingTarget={isLoadingTarget}
        isLoadingLeads={isLoadingLeads}
        onAddLead={handleAddLead}
      />
      
      <CreateLeadDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onLeadCreated={handleLeadCreated}
      />
    </>
  );
}
