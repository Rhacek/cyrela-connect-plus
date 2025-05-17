
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { leadsService } from "@/services/leads.service";

export const useLeadsData = (
  brokerId: string | undefined, 
  enabled: boolean
) => {
  // Fetch recent leads
  const { 
    data: leads, 
    isLoading: isLoadingLeads,
    error: leadsError,
    refetch: refetchLeads
  } = useQuery({
    queryKey: ['brokerLeads', brokerId],
    queryFn: () => leadsService.getBrokerLeads(brokerId || ""),
    enabled: !!brokerId && enabled
  });
  
  // Display toast if leads data fetch fails
  useEffect(() => {
    if (leadsError) {
      console.error("Error fetching leads data:", leadsError);
      toast.error("Não foi possível carregar os leads recentes");
    }
  }, [leadsError]);
  
  // Use actual data or fallback to empty array
  const recentLeads = leads || [];
  
  return {
    recentLeads,
    isLoadingLeads,
    refetchLeads
  };
};
