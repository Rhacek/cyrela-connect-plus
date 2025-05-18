
import { Property, PropertyImage } from '@/types';
import { queryService } from './properties/query.service';
import { mutationService } from './properties/mutation.service';
import { PropertyFilter } from './properties/types';
import { supabase } from '@/integrations/supabase/client';

export const propertiesService = {
  // Query methods
  getAllActiveProperties: queryService.getAllActiveProperties,
  getBrokerProperties: queryService.getAllActiveProperties, // Default implementation using filters
  getById: queryService.getById,
  getProperty: queryService.getById,  // Alias for getById
  getAll: queryService.getAll,

  // Mutation methods
  update: mutationService.update,
  create: mutationService.create,
  delete: mutationService.delete,
  
  // Image related methods
  addImage: mutationService.addImage,
  deleteImage: mutationService.deleteImage,
  
  // Analytics methods
  incrementViews: async (propertyId: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_property_views', { property_id: propertyId });
      if (error) throw error;
    } catch (err) {
      console.error('Error incrementing property views:', err);
      throw err;
    }
  },
  
  incrementShares: async (propertyId: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_property_shares', { property_id: propertyId });
      if (error) throw error;
    } catch (err) {
      console.error('Error incrementing property shares:', err);
      throw err;
    }
  }
};
