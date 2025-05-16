
import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarInset, 
  SidebarProvider
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";
import { StatsGrid } from "@/components/broker/dashboard/stats-grid";
import { RecentLeadsSection } from "@/components/broker/dashboard/recent-leads-section";
import { QuickAccess } from "@/components/broker/dashboard/quick-access";
import { ProgressCard } from "@/components/broker/dashboard/progress-card";
import { Lead, LeadStatus } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { BrokerSidebarContent } from "@/components/broker/sidebar/broker-sidebar-content";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { performanceService } from "@/services/performance.service";
import { targetsService } from "@/services/targets.service";
import { leadsService } from "@/services/leads.service";
import { toast } from "@/hooks/use-toast";

const BrokerDashboard = () => {
  const isMobile = useIsMobile();
  const { session } = useAuth();
  
  // Log user session for debugging
  useEffect(() => {
    console.log("BrokerDashboard: session =", session?.id);
  }, [session]);
  
  // Default empty states for data
  const emptyPerformance = {
    id: "",
    brokerId: session?.id || "",
    month: new Date().getMonth() + 1, // Current month
    year: new Date().getFullYear(),
    shares: 0,
    leads: 0,
    schedules: 0,
    visits: 0,
    sales: 0
  };
  
  const emptyTarget = {
    id: "",
    brokerId: session?.id || "",
    month: new Date().getMonth() + 1, // Current month
    year: new Date().getFullYear(),
    shareTarget: 0,
    leadTarget: 0,
    scheduleTarget: 0,
    visitTarget: 0,
    saleTarget: 0
  };
  
  // Fetch current month's performance data
  const { 
    data: performance, 
    isLoading: isLoadingPerformance,
    error: performanceError
  } = useQuery({
    queryKey: ['brokerPerformance', session?.id],
    queryFn: () => performanceService.getCurrentMonthPerformance(session?.id || ""),
    enabled: !!session?.id
  });
  
  // Display toast if performance data fetch fails
  useEffect(() => {
    if (performanceError) {
      console.error("Error fetching performance data:", performanceError);
      toast.error("Não foi possível carregar os dados de desempenho");
    }
  }, [performanceError]);
  
  // Fetch current month's target data
  const { 
    data: target, 
    isLoading: isLoadingTarget,
    error: targetError
  } = useQuery({
    queryKey: ['brokerTarget', session?.id],
    queryFn: () => targetsService.getCurrentMonthTarget(session?.id || ""),
    enabled: !!session?.id
  });
  
  // Display toast if target data fetch fails
  useEffect(() => {
    if (targetError) {
      console.error("Error fetching target data:", targetError);
      toast.error("Não foi possível carregar os dados de metas");
    }
  }, [targetError]);
  
  // Fetch recent leads
  const { 
    data: leads, 
    isLoading: isLoadingLeads,
    error: leadsError
  } = useQuery({
    queryKey: ['brokerLeads', session?.id],
    queryFn: () => leadsService.getBrokerLeads(session?.id || ""),
    enabled: !!session?.id
  });
  
  // Display toast if leads data fetch fails
  useEffect(() => {
    if (leadsError) {
      console.error("Error fetching leads data:", leadsError);
      toast.error("Não foi possível carregar os leads recentes");
    }
  }, [leadsError]);
  
  const handleAddLead = () => {
    // Function to handle adding a new lead
    console.log("Add lead button clicked");
    // Redirect or open modal logic would go here
  };
  
  // Use actual data or fallback to empty data if not available
  const currentPerformance = performance || emptyPerformance;
  const currentTarget = target || emptyTarget;
  const recentLeads = leads || [];
  
  // Get user name from session if available
  const userName = session?.user_metadata?.name || "";
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-cyrela-gray-lightest">
        <Sidebar>
          <BrokerSidebarContent />
        </Sidebar>
        
        <SidebarInset>
          <ScrollArea className="h-screen w-full">
            <div className="flex flex-col w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
              <DashboardHeader 
                title="Dashboard" 
                description={`Bem-vindo de volta${userName ? ', ' + userName : ''}! Aqui está o resumo do seu desempenho.`}
                buttonLabel="Cadastrar lead"
                onButtonClick={handleAddLead}
              />
              
              <StatsGrid 
                performance={currentPerformance} 
                target={currentTarget} 
                className="w-full mb-4 sm:mb-6"
                isLoading={isLoadingPerformance || isLoadingTarget}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 min-h-[500px] w-full mb-6">
                <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-6 h-full">
                  <RecentLeadsSection 
                    leads={recentLeads} 
                    className="flex-1 w-full"
                    isLoading={isLoadingLeads}
                  />
                  
                  {isMobile ? (
                    <ProgressCard 
                      target={currentTarget} 
                      performance={currentPerformance} 
                      className="w-full"
                      isLoading={isLoadingPerformance || isLoadingTarget}
                    />
                  ) : (
                    <QuickAccess className="flex-1 w-full" />
                  )}
                </div>
                
                {!isMobile && (
                  <div className="h-full">
                    <ProgressCard 
                      target={currentTarget} 
                      performance={currentPerformance} 
                      className="h-full w-full"
                      isLoading={isLoadingPerformance || isLoadingTarget}
                    />
                  </div>
                )}
                
                {isMobile && (
                  <QuickAccess className="w-full" />
                )}
              </div>
            </div>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BrokerDashboard;
