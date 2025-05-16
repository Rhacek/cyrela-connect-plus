
import { useState } from "react";
import { 
  useDashboardSession, 
  usePerformanceData, 
  useTargetData, 
  useLeadsData, 
  useInitializationEffect 
} from "@/hooks/dashboard";

export const useDashboardData = () => {
  const { session, hasInitializedQueries } = useDashboardSession();
  
  // Performance data
  const { currentPerformance, isLoadingPerformance } = usePerformanceData(
    session?.id, 
    hasInitializedQueries
  );
  
  // Target data
  const { currentTarget, isLoadingTarget } = useTargetData(
    session?.id, 
    hasInitializedQueries
  );
  
  // Leads data
  const { recentLeads, isLoadingLeads } = useLeadsData(
    session?.id, 
    hasInitializedQueries
  );
  
  // Initialization effect
  useInitializationEffect(
    session,
    hasInitializedQueries,
    isLoadingPerformance,
    isLoadingTarget,
    currentPerformance,
    currentTarget
  );
  
  return {
    hasInitializedQueries,
    isLoadingPerformance,
    isLoadingTarget,
    isLoadingLeads,
    currentPerformance,
    currentTarget,
    recentLeads,
    handleAddLead: () => {
      console.log("Add lead button clicked");
      // Redirect or open modal logic would go here
    }
  };
};
