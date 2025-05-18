
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { leadsService } from "@/services/leads.service";
import { Lead, LeadStatus, Property, Performance } from "@/types";
import { propertiesService } from "@/services/properties/query.service";
import { getCurrentMonthPerformance } from "@/services/performance/performance-query.service";

export const useDashboardData = (brokerId: string | undefined) => {
  // Fetch recent leads
  const { 
    data: leads, 
    isLoading: isLoadingLeads,
    error: leadsError,
    refetch: refetchLeads
  } = useQuery({
    queryKey: ['brokerLeads', brokerId],
    queryFn: () => leadsService.getBrokerLeads(brokerId || ""),
    enabled: !!brokerId
  });
  
  // Fetch highlighted properties
  const { 
    data: properties, 
    isLoading: isLoadingProperties,
    error: propertiesError
  } = useQuery({
    queryKey: ['highlightedProperties'],
    queryFn: () => propertiesService.getHighlightedProperties(),
    enabled: true
  });
  
  // Fetch current month performance
  const { 
    data: performance,
    refetch: refetchMetrics,
    error: performanceError 
  } = useQuery({
    queryKey: ['currentMonthPerformance', brokerId],
    queryFn: () => getCurrentMonthPerformance(brokerId || ""),
    enabled: !!brokerId
  });
  
  // Handle errors
  useEffect(() => {
    if (leadsError) {
      console.error("Error fetching leads:", leadsError);
      toast.error("Não foi possível carregar os leads recentes");
    }
    
    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError);
      toast.error("Não foi possível carregar os imóveis destacados");
    }
    
    if (performanceError) {
      console.error("Error fetching performance metrics:", performanceError);
      toast.error("Não foi possível carregar as métricas de desempenho");
    }
  }, [leadsError, propertiesError, performanceError]);
  
  return {
    leads: leads || [],
    properties: properties || [],
    performance: performance || null,
    isLoadingLeads,
    isLoadingProperties,
    refetchLeads,
    refetchMetrics
  };
};
