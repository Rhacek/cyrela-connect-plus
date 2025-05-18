
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { leadsService } from "@/services/leads.service";
import { LeadStatus } from "@/types";

interface LeadFilters {
  name?: string;
  status?: LeadStatus | "ALL";
  fromDate?: string;
  toDate?: string;
}

export const useLeadsData = (
  brokerId: string | undefined, 
  enabled: boolean,
  filters?: LeadFilters
) => {
  // Convert filters to a serialized string for query key
  const filtersKey = filters ? JSON.stringify(filters) : "default";
  
  // Fetch leads with filters
  const { 
    data: leads, 
    isLoading: isLoadingLeads,
    error: leadsError,
    refetch: refetchLeads
  } = useQuery({
    queryKey: ['brokerLeads', brokerId, filtersKey],
    queryFn: () => leadsService.getBrokerLeads(brokerId || "", filters),
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
