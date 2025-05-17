
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";
import { StatsGrid } from "@/components/broker/dashboard/stats-grid";
import { RecentLeadsSection } from "@/components/broker/dashboard/recent-leads-section";
import { QuickAccess } from "@/components/broker/dashboard/quick-access";
import { ProgressCard } from "@/components/broker/dashboard/progress-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

interface DashboardContentProps {
  userName: string;
  performance: any;
  target: any;
  leads: any[];
  isLoadingPerformance: boolean;
  isLoadingTarget: boolean;
  isLoadingLeads: boolean;
  onAddLead: () => void;
}

export function DashboardContent({
  userName,
  performance,
  target,
  leads,
  isLoadingPerformance,
  isLoadingTarget,
  isLoadingLeads,
  onAddLead
}: DashboardContentProps) {
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  
  return (
    <div className="w-full transition-all duration-300">
      <DashboardHeader 
        title="Dashboard" 
        description={`Bem-vindo de volta${userName ? ', ' + userName : ''}! Aqui está o resumo do seu desempenho.`}
        buttonLabel="Cadastrar lead"
        onButtonClick={onAddLead}
      />
      
      <StatsGrid 
        performance={performance} 
        target={target} 
        className="w-full mb-4 sm:mb-6"
        isLoading={isLoadingPerformance || isLoadingTarget}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 min-h-[500px] w-full mb-6">
        <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-6 h-full">
          <RecentLeadsSection 
            leads={leads} 
            className="flex-1 w-full"
            isLoading={isLoadingLeads}
          />
          
          {isMobile ? (
            <ProgressCard 
              target={target} 
              performance={performance} 
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
              target={target} 
              performance={performance} 
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
  );
}
