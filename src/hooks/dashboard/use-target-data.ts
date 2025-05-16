
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Target } from "@/types";
import { targetsService } from "@/services/targets.service";

export const useTargetData = (
  brokerId: string | undefined, 
  enabled: boolean
) => {
  // Get current month and year for queries
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  
  // Default empty state for data
  const emptyTarget: Target = {
    id: "",
    brokerId: brokerId || "",
    month: currentMonth,
    year: currentYear,
    shareTarget: 0,
    leadTarget: 0,
    scheduleTarget: 0,
    visitTarget: 0,
    saleTarget: 0
  };
  
  // Fetch current month's target data
  const { 
    data: target, 
    isLoading: isLoadingTarget,
    error: targetError
  } = useQuery({
    queryKey: ['brokerTarget', brokerId, currentMonth, currentYear],
    queryFn: () => targetsService.getCurrentMonthTarget(brokerId || ""),
    enabled: !!brokerId && enabled
  });
  
  // Display toast if target data fetch fails
  useEffect(() => {
    if (targetError) {
      console.error("Error fetching target data:", targetError);
      toast.error("Não foi possível carregar os dados de metas");
    }
  }, [targetError]);
  
  // Map database fields to our frontend models
  const mapTargetData = (data: any): Target => {
    if (!data) {
      console.log("No target data found, using empty target object");
      return emptyTarget;
    }
    
    console.log("Mapping target data:", data);
    return {
      id: data.id || "",
      brokerId: data.brokerId || brokerId || "", 
      month: data.month || currentMonth,
      year: data.year || currentYear,
      shareTarget: data.shareTarget || 0,
      leadTarget: data.leadTarget || 0,
      scheduleTarget: data.scheduleTarget || 0,
      visitTarget: data.visitTarget || 0,
      saleTarget: data.saleTarget || 0
    };
  };
  
  // Use actual data or fallback to empty data
  const currentTarget = target ? target : emptyTarget;
  
  return {
    currentTarget,
    isLoadingTarget
  };
};
