
import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarInset, 
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrokerSidebarContent } from "@/components/broker/sidebar/broker-sidebar-content";
import { MetricsHeader } from "@/components/broker/metrics/metrics-header";
import { MetricsFilter } from "@/components/broker/metrics/metrics-filter";
import { MetricsOverview } from "@/components/broker/metrics/metrics-overview";
import { MetricsCharts } from "@/components/broker/metrics/metrics-charts";
import { Performance, Target } from "@/types";
import { useAuth } from "@/context/auth-context";
import { performanceService } from "@/services/performance.service";
import { targetsService } from "@/services/targets.service";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrokerMetrics() {
  // Get current month and year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [isLoadingTarget, setIsLoadingTarget] = useState(false);
  const { session } = useAuth();
  
  // Default empty performance and target objects
  const emptyPerformance: Performance = {
    id: "",
    brokerId: session?.id || "",
    month: selectedMonth + 1,
    year: selectedYear,
    shares: 0,
    leads: 0,
    schedules: 0,
    visits: 0,
    sales: 0
  };
  
  const emptyTarget: Target = {
    id: "",
    brokerId: session?.id || "",
    month: selectedMonth + 1,
    year: selectedYear,
    shareTarget: 0,
    leadTarget: 0,
    scheduleTarget: 0,
    visitTarget: 0,
    saleTarget: 0
  };
  
  // Update data when month or year changes
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.id) return;
      
      try {
        console.log(`Fetching performance and target data for: ${selectedMonth+1}/${selectedYear} for broker ${session.id}`);
        
        // Fetch performance data
        setIsLoadingPerformance(true);
        let performanceData: Performance[] = [];
        
        try {
          performanceData = await performanceService.getMonthlyPerformance(session.id, selectedYear);
        } catch (error) {
          console.error("Error fetching performance data:", error);
          toast.error("Não foi possível carregar os dados de desempenho");
        } finally {
          setIsLoadingPerformance(false);
        }
        
        // Find performance data for selected month, or use empty values
        const monthPerformance = performanceData.find(p => p.month === selectedMonth + 1);
        
        if (monthPerformance) {
          // Map database fields to frontend model
          setPerformance({
            ...monthPerformance,
            brokerId: monthPerformance.broker_id
          });
        } else {
          // No data found, use empty performance
          setPerformance(emptyPerformance);
        }
        
        // Fetch target data
        setIsLoadingTarget(true);
        let targetData: Target[] = [];
        
        try {
          targetData = await targetsService.getMonthlyTargets(session.id, selectedYear);
        } catch (error) {
          console.error("Error fetching target data:", error);
          toast.error("Não foi possível carregar os dados de metas");
        } finally {
          setIsLoadingTarget(false);
        }
        
        // Find target data for selected month, or use empty values
        const monthTarget = targetData.find(t => t.month === selectedMonth + 1);
        
        if (monthTarget) {
          // Map database fields to frontend model
          setTarget({
            ...monthTarget,
            brokerId: monthTarget.broker_id,
            shareTarget: monthTarget.share_target,
            leadTarget: monthTarget.lead_target, 
            scheduleTarget: monthTarget.schedule_target,
            visitTarget: monthTarget.visit_target,
            saleTarget: monthTarget.sale_target
          });
        } else {
          // No data found, use empty target
          setTarget(emptyTarget);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Ocorreu um erro ao buscar os dados");
      }
    };
    
    fetchData();
  }, [selectedMonth, selectedYear, session?.id]);

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <SidebarProvider>
      {({ state }) => (
        <div className="flex h-screen w-full bg-cyrela-gray-lightest">
          <Sidebar>
            <BrokerSidebarContent />
          </Sidebar>
          
          <SidebarInset>
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col h-full w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
                <MetricsHeader />
                
                <MetricsFilter 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthYearChange={handleMonthYearChange}
                />
                
                {isLoadingPerformance || isLoadingTarget ? (
                  <div className="space-y-6 mb-8">
                    <Skeleton className="h-40 w-full" />
                  </div>
                ) : (
                  <MetricsOverview 
                    performance={performance || emptyPerformance}
                    target={target || emptyTarget}
                  />
                )}
                
                {isLoadingPerformance || isLoadingTarget ? (
                  <Skeleton className="h-96 w-full" />
                ) : (
                  <MetricsCharts 
                    performance={performance || emptyPerformance}
                    target={target || emptyTarget}
                    period={`${selectedMonth}_${selectedYear}`}
                  />
                )}
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
