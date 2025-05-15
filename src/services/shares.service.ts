
import { supabase } from '@/lib/supabase';
import { SharedLink } from '@/types/share';

export const sharesService = {
  async getAll(): Promise<SharedLink[]> {
    const { data, error } = await supabase
      .from('shares')
      .select(`
        *,
        property:properties(*)
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching shared links:', error);
      throw error;
    }

    return data as unknown as SharedLink[];
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

    return data as unknown as SharedLink;
  },

  async create(shareLink: Omit<SharedLink, 'id' | 'createdAt' | 'property'>): Promise<SharedLink> {
    const newShareLink = {
      ...shareLink,
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('shares')
      .insert(newShareLink)
      .select()
      .single();

    if (error) {
      console.error('Error creating shared link:', error);
      throw error;
    }

    return data as unknown as SharedLink;
  },

  async update(id: string, shareLink: Partial<SharedLink>): Promise<SharedLink> {
    const { data, error } = await supabase
      .from('shares')
      .update(shareLink)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating shared link with id ${id}:`, error);
      throw error;
    }

    return data as unknown as SharedLink;
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
      .eq('brokerId', brokerId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error(`Error fetching shared links for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as SharedLink[];
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
