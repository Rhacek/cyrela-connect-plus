
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Performance } from "@/types";
import { getCurrentMonthPerformance } from "@/services/performance";

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
    error: performanceError
  } = useQuery({
    queryKey: ['brokerPerformance', brokerId, currentMonth, currentYear],
    queryFn: () => getCurrentMonthPerformance(brokerId || ""),
    enabled: !!brokerId && enabled
  });
  
  // Display toast if performance data fetch fails
  useEffect(() => {
    if (performanceError) {
      console.error("Error fetching performance data:", performanceError);
      toast.error("Não foi possível carregar os dados de desempenho");
    }
  }, [performanceError]);
  
  // Use actual data or fallback to empty data
  const currentPerformance = performance ? performance : emptyPerformance;
  
  return {
    currentPerformance,
    isLoadingPerformance
  };
};
