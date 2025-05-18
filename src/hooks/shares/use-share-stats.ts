
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShareStats } from "@/types/share";

/**
 * Hook to fetch broker's share statistics
 */
export function useShareStats(brokerId: string | undefined) {
  return useQuery({
    queryKey: ['brokerShareStats', brokerId],
    queryFn: async () => {
      try {
        if (!brokerId) return {
          totalShares: 0,
          totalClicks: 0,
          activeLinks: 0,
          averageClicksPerShare: 0,
          mostSharedProperty: null
        };
        
        const { data, error } = await supabase
          .rpc('get_broker_share_stats', { broker_id: brokerId });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return {
            totalShares: 0,
            totalClicks: 0,
            activeLinks: 0,
            averageClicksPerShare: 0,
            mostSharedProperty: null
          };
        }
        
        // Safely handle the most_shared_property which can be of different types
        let mostSharedProperty = null;
        
        if (data[0].most_shared_property) {
          const msProperty = data[0].most_shared_property;
          
          if (typeof msProperty === 'object' && msProperty !== null) {
            if ('id' in msProperty && 'name' in msProperty && 'count' in msProperty) {
              mostSharedProperty = {
                id: String(msProperty.id || ''),
                name: String(msProperty.name || ''),
                count: Number(msProperty.count || 0)
              };
            }
          }
        }
        
        return {
          totalShares: data[0].total_shares || 0,
          totalClicks: data[0].total_clicks || 0,
          activeLinks: data[0].active_links || 0,
          averageClicksPerShare: data[0].average_clicks_per_share || 0,
          mostSharedProperty
        } as ShareStats;
      } catch (err) {
        console.error("Error fetching share stats:", err);
        throw err;
      }
    },
    enabled: !!brokerId
  });
}
