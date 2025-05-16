
import { supabase } from '@/integrations/supabase/client';
import { SharedLink } from '@/types/share';

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
        property:properties(*)
      `)
      .eq('broker_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching shared links for broker ${brokerId}:`, error);
      throw error;
    }

    return data.map(mapFromDbModel);
  },

  async incrementClickCount(code: string): Promise<void> {
    const { error } = await supabase.rpc('increment_share_clicks', { share_code: code });

    if (error) {
      console.error(`Error incrementing click count for shared link with code ${code}:`, error);
      throw error;
    }
  },

  async getShareStats(brokerId: string) {
    const { data, error } = await supabase.rpc('get_broker_share_stats', { broker_id: brokerId });

    if (error) {
      console.error(`Error fetching share stats for broker ${brokerId}:`, error);
      throw error;
    }

    return data;
  }
};
