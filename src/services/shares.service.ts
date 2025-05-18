
import { supabase } from '@/integrations/supabase/client';
import { SharedLink, ShareStats } from '@/types/share';

// Type mapper functions
const mapFromDbModel = (dbModel: any): SharedLink => ({
  id: dbModel.id,
  brokerId: dbModel.broker_id,
  propertyId: dbModel.property_id,
  code: dbModel.code,
  url: dbModel.url,
  createdAt: dbModel.created_at,
  expiresAt: dbModel.expires_at,
  clicks: dbModel.clicks,
  lastClickedAt: dbModel.last_clicked_at,
  isActive: dbModel.is_active,
  notes: dbModel.notes,
  property: dbModel.property,
});

const mapToDbModel = (model: Partial<SharedLink>) => ({
  broker_id: model.brokerId,
  property_id: model.propertyId,
  code: model.code,
  url: model.url,
  created_at: model.createdAt,
  expires_at: model.expiresAt,
  clicks: model.clicks,
  last_clicked_at: model.lastClickedAt,
  is_active: model.isActive,
  notes: model.notes,
});

// Core service functions
export const sharesService = {
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

    return data ? mapFromDbModel(data) : null;
  },

  async create(shareLink: Omit<SharedLink, 'id' | 'createdAt' | 'property'>): Promise<SharedLink> {
    const dbShareLink = {
      ...mapToDbModel(shareLink),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('shares')
      .insert(dbShareLink)
      .select()
      .single();

    if (error) {
      console.error('Error creating shared link:', error);
      throw error;
    }

    return mapFromDbModel(data);
  },

  async update(id: string, shareLink: Partial<SharedLink>): Promise<SharedLink> {
    const dbShareLink = mapToDbModel(shareLink);

    const { data, error } = await supabase
      .from('shares')
      .update(dbShareLink)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating shared link with id ${id}:`, error);
      throw error;
    }

    return mapFromDbModel(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('shares')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting shared link with id ${id}:`, error);
      throw error;
    }
  },

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

  async incrementClickCount(code: string): Promise<void> {
    const { error } = await supabase.rpc('increment_share_clicks', { share_code: code });

    if (error) {
      console.error(`Error incrementing click count for shared link with code ${code}:`, error);
      throw error;
    }
  },

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
  },

  async createShareLink({ 
    brokerId, 
    propertyId, 
    notes 
  }: { 
    brokerId: string; 
    propertyId: string; 
    notes?: string 
  }): Promise<SharedLink> {
    if (!brokerId) throw new Error("Broker ID not found");
    
    // Generate a random code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const url = `https://living.com.br/s/${code}`;
    
    const { data, error } = await supabase
      .from('shares')
      .insert({
        broker_id: brokerId,
        property_id: propertyId,
        code,
        url,
        notes,
        is_active: true
      })
      .select(`
        id, code, url, created_at, clicks, is_active, notes,
        property_id, broker_id,
        properties:property_id (title, development_name)
      `)
      .single();
    
    if (error) throw error;
    
    // Increment property share count
    await supabase.rpc('increment_property_shares', { property_id: propertyId });
    
    return mapFromDbModel(data);
  }
};
