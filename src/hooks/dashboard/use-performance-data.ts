
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Performance } from "@/types";
import { 
  getCurrentMonthPerformance,
  getBrokerLeadCount,
  getBrokerScheduledVisitsCount
} from "@/services/performance";

export const usePerformanceData = (
  brokerId: string | undefined, 
  enabled: boolean
) => {
  // Get current month and year for queries
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  
  // Default empty state for data
  const emptyPerformance: Performance = {
    id: "",
    brokerId: brokerId || "", 
    month: currentMonth,
    year: currentYear,
    shares: 0,
    leads: 0,
    schedules: 0,
    visits: 0,
    sales: 0
  };
  
  // Fetch current month's performance data
  const { 
    data: performance, 
    isLoading: isLoadingPerformance,
    error: performanceError,
    refetch: refetchPerformance
  } = useQuery({
    queryKey: ['brokerPerformance', brokerId, currentMonth, currentYear],
    queryFn: () => getCurrentMonthPerformance(brokerId || ""),
    enabled: !!brokerId && enabled
  });
  
  // Fetch real-time lead count
  const { 
    data: leadCount,
    refetch: refetchLeadCount 
  } = useQuery({
    queryKey: ['brokerLeadCount', brokerId],
    queryFn: () => getBrokerLeadCount(brokerId || ""),
    enabled: !!brokerId && enabled
  });
  
  // Fetch real-time scheduled visits count
  const { 
    data: scheduledVisitsCount,
    refetch: refetchScheduledVisits 
  } = useQuery({
    queryKey: ['brokerScheduledVisits', brokerId],
    queryFn: () => getBrokerScheduledVisitsCount(brokerId || ""),
    enabled: !!brokerId && enabled
  });
  
  // Merge real-time data with performance data
  const [currentPerformance, setCurrentPerformance] = useState<Performance>(emptyPerformance);
  
  useEffect(() => {
    if (performance) {
      // Start with the base performance data
      const updatedPerformance = { ...performance };
      
      // Update with real-time metrics if available
      if (leadCount !== undefined) {
        updatedPerformance.leads = leadCount;
      }
      
      if (scheduledVisitsCount !== undefined) {
        updatedPerformance.schedules = scheduledVisitsCount;
      }
      
      setCurrentPerformance(updatedPerformance);
    } else {
      setCurrentPerformance(emptyPerformance);
    }
  }, [performance, leadCount, scheduledVisitsCount]);
  
  // Display toast if performance data fetch fails
  useEffect(() => {
    if (performanceError) {
      console.error("Error fetching performance data:", performanceError);
      toast.error("Não foi possível carregar os dados de desempenho");
    }
  }, [performanceError]);
  
  // Function to refetch all performance metrics
  const refreshAllMetrics = () => {
    refetchPerformance();
    refetchLeadCount();
    refetchScheduledVisits();
  };
  
  return {
    currentPerformance,
    isLoadingPerformance,
    refreshAllMetrics
  };
};
