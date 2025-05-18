
import { supabase } from '@/integrations/supabase/client';
import { mapFromDbModel } from './shares-mapper.service';
import { ShareDbModel, SharedLink, ShareStats } from './shares-types';

/**
 * Service for fetching shares data
 */
export const sharesQueryService = {
  /**
   * Fetch all shared links
   */
  async getAll(): Promise<SharedLink[]> {
    const { data, error } = await supabase
      .from('shares')
      .select(`
        *,
        property:properties(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shared links:', error);
      throw error;
    }

    return data.map(mapFromDbModel);
  },

  /**
   * Fetch a single shared link by ID
   */
  async getById(id: string): Promise<SharedLink | null> {
    const { data, error } = await supabase
      .from('shares')
      .select(`
        *,
        property:properties(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching shared link with id ${id}:`, error);
      throw error;
    }

    return data ? mapFromDbModel(data as ShareDbModel) : null;
  },

  /**
   * Fetch broker's shared links
   */
  async getBrokerShares(brokerId: string): Promise<SharedLink[]> {
    const { data, error } = await supabase
      .from('shares')
      .select(`
        *,
        properties:property_id (title, development_name, images:property_images(url))
      `)
      .eq('broker_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching shared links for broker ${brokerId}:`, error);
      throw error;
    }

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
  },

  /**
   * Get broker's share statistics
   */
  async getShareStats(brokerId: string): Promise<ShareStats> {
    const { data, error } = await supabase.rpc('get_broker_share_stats', { broker_id: brokerId });

    if (error) {
      console.error(`Error fetching share stats for broker ${brokerId}:`, error);
      throw error;
    }

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
    };
  }
};
