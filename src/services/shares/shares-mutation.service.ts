
import { supabase } from '@/integrations/supabase/client';
import { mapFromDbModel, mapToDbModel } from './shares-mapper.service';
import { CreateShareParams, SharedLink } from './shares-types';

/**
 * Service for creating and modifying shares data
 */
export const sharesMutationService = {
  /**
   * Create a new shared link
   */
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

  /**
   * Update an existing shared link
   */
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

  /**
   * Delete a shared link
   */
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

  /**
   * Increment click count for a shared link
   */
  async incrementClickCount(code: string): Promise<void> {
    const { error } = await supabase.rpc('increment_share_clicks', { share_code: code });

    if (error) {
      console.error(`Error incrementing click count for shared link with code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Create a new share link with generated code
   */
  async createShareLink({ 
    brokerId, 
    propertyId, 
    notes 
  }: CreateShareParams): Promise<SharedLink> {
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
