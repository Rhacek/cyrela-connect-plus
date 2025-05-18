
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SharedLink } from "@/types/share";

/**
 * Hook to fetch broker's shared links
 */
export function useShareLinks(brokerId: string | undefined) {
  return useQuery({
    queryKey: ['brokerShares', brokerId],
    queryFn: async () => {
      try {
        if (!brokerId) return [];
        
        const { data, error } = await supabase
          .from('shares')
          .select(`
            id, code, url, created_at, clicks, is_active, notes, last_clicked_at, expires_at,
            property_id, broker_id,
            properties:property_id (title, development_name, images:property_images(url))
          `)
          .eq('broker_id', brokerId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data.map((share: any): SharedLink => ({
          id: share.id,
          brokerId: share.broker_id,
          propertyId: share.property_id,
          property: share.properties ? {
            id: share.property_id,
            title: share.properties.title || "Imóvel sem título",
            developmentName: share.properties.development_name || "",
            images: share.properties.images || [],
            // Add missing required Property fields with default values
            description: "",
            type: "",
            price: 0,
            area: 0,
            bedrooms: 0,
            bathrooms: 0,
            suites: 0,
            parkingSpaces: 0,
            address: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: "",
            isActive: true,
            isHighlighted: false,
            viewCount: 0,
            shareCount: 0
          } : undefined,
          code: share.code,
          url: share.url,
          createdAt: share.created_at,
          clicks: share.clicks,
          isActive: share.is_active,
          notes: share.notes,
          lastClickedAt: share.last_clicked_at || undefined,
          expiresAt: share.expires_at || undefined
        }));
      } catch (err) {
        console.error("Error fetching share links:", err);
        throw err;
      }
    },
    enabled: !!brokerId
  });
}
