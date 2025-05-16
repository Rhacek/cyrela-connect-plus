
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthPerformance, ensureCurrentMonthPerformance } from "@/services/performance.service";
import { targetsService } from "@/services/targets.service";
import { leadsService } from "@/services/leads.service"; // Updated import
import { logAuthState } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Performance, Target } from "@/types";

export const useDashboardData = () => {
  const { session } = useAuth();
  const [hasInitializedQueries, setHasInitializedQueries] = useState(false);
  
  // Get current month and year for queries
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  
  // Default empty states for data
  const emptyPerformance: Performance = {
    id: "",
    brokerId: session?.id || "", 
    month: currentMonth,
    year: currentYear,
    shares: 0,
    leads: 0,
    schedules: 0,
    visits: 0,
    sales: 0
  };
  
  const emptyTarget: Target = {
    id: "",
    brokerId: session?.id || "",
    month: currentMonth,
    year: currentYear,
    shareTarget: 0,
    leadTarget: 0,
    scheduleTarget: 0,
    visitTarget: 0,
    saleTarget: 0
  };

  // Check if session is available, but only run once
  useEffect(() => {
    const initializeQueries = async () => {
      if (session?.id && !hasInitializedQueries) {
        console.log("Verifying auth state from Supabase directly...");
        const currentSession = await logAuthState();
        
        if (currentSession) {
          console.log("Session verified, initializing queries");
          setHasInitializedQueries(true);
        } else {
          console.log("Session not verified, redirecting to auth");
          toast.error("Sessão expirada. Faça login novamente.");
        }
      }
    };
    
    initializeQueries();
  }, [session, hasInitializedQueries]);
  
  // Fetch current month's performance data
  const { 
    data: performance, 
    isLoading: isLoadingPerformance,
    error: performanceError
  } = useQuery({
    queryKey: ['brokerPerformance', session?.id, currentMonth, currentYear],
    queryFn: () => performanceService.getCurrentMonthPerformance(session?.id || ""),
    enabled: !!session?.id && hasInitializedQueries
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
    queryKey: ['brokerTarget', session?.id, currentMonth, currentYear],
    queryFn: () => targetsService.getCurrentMonthTarget(session?.id || ""),
    enabled: !!session?.id && hasInitializedQueries
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
    enabled: !!session?.id && hasInitializedQueries
  });
  
  // Display toast if leads data fetch fails
  useEffect(() => {
    if (leadsError) {
      console.error("Error fetching leads data:", leadsError);
      toast.error("Não foi possível carregar os leads recentes");
    }
  }, [leadsError]);
  
  // Map database fields to our frontend models
  const mapPerformanceData = (data: any) => {
    if (!data) {
      console.log("No performance data found, using empty performance object");
      return emptyPerformance;
    }
    
    console.log("Mapping performance data:", data);
    return {
      id: data.id || "",
      brokerId: data.broker_id || session?.id || "", 
      month: data.month || currentMonth,
      year: data.year || currentYear,
      shares: data.shares || 0,
      leads: data.leads || 0,
      schedules: data.schedules || 0,
      visits: data.visits || 0,
      sales: data.sales || 0
    };
  };
  
  const mapTargetData = (data: any) => {
    if (!data) {
      console.log("No target data found, using empty target object");
      return emptyTarget;
    }
    
    console.log("Mapping target data:", data);
    return {
      id: data.id || "",
      brokerId: data.broker_id || session?.id || "", 
      month: data.month || currentMonth,
      year: data.year || currentYear,
      shareTarget: data.share_target || 0,
      leadTarget: data.lead_target || 0,
      scheduleTarget: data.schedule_target || 0,
      visitTarget: data.visit_target || 0,
      saleTarget: data.sale_target || 0
    };
  };
  
  // Use actual data or fallback to empty data if not available
  const currentPerformance = mapPerformanceData(performance);
  const currentTarget = mapTargetData(target);
  const recentLeads = leads || [];
  
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
