
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatisticsGrid } from "@/components/admin/dashboard/StatisticsGrid";
import { DashboardContent } from "@/components/admin/dashboard/DashboardContent";
import { useAdminDashboardData } from "@/hooks/use-admin-dashboard-data";

const AdminDashboard = () => {
  const { 
    stats, 
    isLoading,
    error
  } = useAdminDashboardData();
  
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatisticsGrid 
        totalProperties={stats?.totalProperties || 0}
        activeAgents={stats?.activeAgents || 0}
        pendingLeads={stats?.pendingLeads || 0}
        conversionRate={stats?.conversionRate || 0}
        propertiesGrowth={stats?.propertiesGrowth || 0}
        brokersGrowth={stats?.brokersGrowth || 0} 
        leadsGrowth={stats?.leadsGrowth || 0}
      />
      <DashboardContent 
        recentProperties={stats?.recentProperties || []}
        recentActivities={stats?.recentActivities || []}
      />
    </div>
  );
};

export default AdminDashboard;
