
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
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { performanceService } from "@/services/performance.service";
import { targetsService } from "@/services/targets.service";
import { supabase } from "@/lib/supabase";

const BrokerDashboard = () => {
  const { session, initialized } = useAuth();
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
  
  // Verify session on dashboard load for extra security - with throttling
  useEffect(() => {
    const checkSessionValid = async () => {
      if (session?.id) {
        try {
          // Check at most once per minute
          const lastCheck = sessionStorage.getItem('lastSessionCheck');
          const now = Date.now();
          
          if (lastCheck && now - parseInt(lastCheck) < 60000) {
            return; // Skip check if done recently
          }
          
          sessionStorage.setItem('lastSessionCheck', now.toString());
          
          const { data, error } = await supabase.auth.getUser();
          if (error || !data.user) {
            console.error("Dashboard session verification failed:", error);
            // Auth will handle redirect via periodic session check
          } else {
            console.log("Dashboard session verified valid");
          }
        } catch (err) {
          console.error("Error verifying dashboard session:", err);
        }
      }
    };
    
    checkSessionValid();
  }, [session?.id]);
  
  // Check if performance and target data exists, and create them if not
  useEffect(() => {
    const ensureInitialData = async () => {
      if (session?.id && hasInitializedQueries && !isLoadingPerformance && !isLoadingTarget) {
        try {
          // If currentPerformance or currentTarget are empty records (all zeros),
          // we should ensure records exist in the database for future queries
          const hasPerformanceData = Object.values(currentPerformance).some(val => 
            typeof val === 'number' && val > 0 && val !== currentPerformance.month && val !== currentPerformance.year
          );
          
          const hasTargetData = Object.values(currentTarget).some(val => 
            typeof val === 'number' && val > 0 && val !== currentTarget.month && val !== currentTarget.year
          );
          
          if (!hasPerformanceData) {
            console.log("No performance data found, ensuring record exists in database");
            await performanceService.ensureCurrentMonthPerformance(session.id);
          }
          
          if (!hasTargetData) {
            console.log("No target data found, ensuring record exists in database");
            await targetsService.ensureCurrentMonthTarget(session.id);
          }
          
          if (!hasPerformanceData || !hasTargetData) {
            toast.info("Dados iniciais criados. Os valores serão atualizados automaticamente com o seu uso do sistema.");
          }
        } catch (error) {
          console.error("Error ensuring initial data:", error);
        }
      }
    };
    
    ensureInitialData();
  }, [session?.id, hasInitializedQueries, isLoadingPerformance, isLoadingTarget, currentPerformance, currentTarget]);
  
  // Get user name from session if available
  const userName = session?.user_metadata?.name || "";
  
  // Show a more informative loading state if we're still verifying auth
  if (!initialized || !hasInitializedQueries) {
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
