
import { DashboardContent } from "@/components/broker/dashboard/dashboard-content";
import { DashboardLoading } from "@/components/broker/dashboard/dashboard-loading";
import { useAuth } from "@/context/auth-context";
import { useTargetData } from "@/hooks/dashboard/use-target-data";
import { usePerformanceData } from "@/hooks/dashboard/use-performance-data";
import { useLeadsData } from "@/hooks/dashboard/use-leads-data";

export default function BrokerDashboard() {
  const { session } = useAuth();
  const brokerId = session?.id;
  const sessionEnabled = !!session;

  // Fetch data from Supabase
  const { currentTarget, isLoadingTarget } = useTargetData(brokerId, sessionEnabled);
  const { currentPerformance, isLoadingPerformance } = usePerformanceData(brokerId, sessionEnabled);
  const { recentLeads, isLoadingLeads } = useLeadsData(brokerId, sessionEnabled);

  // Show loading state if any data is still loading
  if (isLoadingTarget || isLoadingPerformance || isLoadingLeads) {
    return <DashboardLoading />;
  }

  const handleAddLead = () => {
    // This will be implemented in the future
    console.log("Add lead clicked");
  };

  return (
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
  );
}
