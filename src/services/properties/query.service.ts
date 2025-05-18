
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { mapPropertyFromDb, mapImageFromDb } from "./mappers";
import { PropertyFilter } from "./types";

export const queryService = {
  // Get all properties
  getAll: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((prop: any) => {
      const images = prop.images.map(mapImageFromDb);
      return mapPropertyFromDb(prop, images);
    });
  },

  // Get active properties with filter support
  getAllActiveProperties: async (filter?: PropertyFilter): Promise<Property[]> => {
    let query = supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filter) {
      // Text search
      if (filter.search) {
        query = query.or(
          `title.ilike.%${filter.search}%,description.ilike.%${filter.search}%,neighborhood.ilike.%${filter.search}%,city.ilike.%${filter.search}%`
        );
      }
      
      // Price range
      if (filter.priceMin) query = query.gte('price', filter.priceMin);
      if (filter.priceMax) query = query.lte('price', filter.priceMax);
      
      // Locations (neighborhoods or cities)
      if (filter.locations && filter.locations.length > 0) {
        query = query.or(
          filter.locations.map(loc => `neighborhood.eq.${loc},city.eq.${loc}`).join(',')
        );
      }
      
      // Bedrooms 
      if (filter.bedrooms && filter.bedrooms.length > 0) {
        query = query.in('bedrooms', filter.bedrooms);
      }
      
      // Construction stages
      if (filter.constructionStages && filter.constructionStages.length > 0) {
        query = query.in('construction_stage', filter.constructionStages);
      }
      
      // Active property filter can be controlled
      if (filter.isActive !== undefined) {
        query = query.eq('is_active', filter.isActive);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;

    return data.map((prop: any) => {
      const images = prop.images.map(mapImageFromDb);
      return mapPropertyFromDb(prop, images);
    });
  },

  // Get properties for a specific broker
  getBrokerProperties: async (brokerId: string): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('created_by_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((prop: any) => {
      const images = prop.images.map(mapImageFromDb);
      return mapPropertyFromDb(prop, images);
    });
  },

  // Get a property by ID
  getById: async (id: string): Promise<Property> => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const images = data.images.map(mapImageFromDb);
    return mapPropertyFromDb(data, images);
  }
};
