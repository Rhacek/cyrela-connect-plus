
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { performanceService } from "@/services/performance.service";
import { targetsService } from "@/services/targets.service";
import { leadsService } from "@/services/leads.service";
import { logAuthState } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useDashboardData = () => {
  const { session } = useAuth();
  const [hasInitializedQueries, setHasInitializedQueries] = useState(false);
  
  // Default empty states for data
  const emptyPerformance = {
    id: "",
    broker_id: session?.id || "", 
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    shares: 0,
    leads: 0,
    schedules: 0,
    visits: 0,
    sales: 0
  };
  
  const emptyTarget = {
    id: "",
    broker_id: session?.id || "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    share_target: 0,
    lead_target: 0,
    schedule_target: 0,
    visit_target: 0,
    sale_target: 0
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
    queryKey: ['brokerPerformance', session?.id],
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
    queryKey: ['brokerTarget', session?.id],
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
    if (!data) return emptyPerformance;
    
    return {
      ...data,
      brokerId: data.broker_id // Map for component usage
    };
  };
  
  const mapTargetData = (data: any) => {
    if (!data) return emptyTarget;
    
    return {
      ...data,
      brokerId: data.broker_id, // Map for component usage
      shareTarget: data.share_target,
      leadTarget: data.lead_target,
      scheduleTarget: data.schedule_target,
      visitTarget: data.visit_target,
      saleTarget: data.sale_target
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
