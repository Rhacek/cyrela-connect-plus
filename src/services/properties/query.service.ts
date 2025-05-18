
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types';
import { mapImageFromDb, mapPropertyFromDb } from './mappers';
import { PropertyFilter } from './types';

export const queryService = {
  async getAllActiveProperties(filters?: PropertyFilter): Promise<Property[]> {
    try {
      // Create query builder
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true);
      
      // Apply filters if provided
      if (filters) {
        // Price range filter
        if (filters.priceMin !== undefined) {
          query = query.gte('price', filters.priceMin);
        }
        
        if (filters.priceMax !== undefined) {
          query = query.lte('price', filters.priceMax);
        }
        
        // Location filter (city or neighborhood)
        if (filters.locations && filters.locations.length > 0) {
          // This handles both city and neighborhood in a single OR condition
          const locationConditions = filters.locations.map(loc => `city.eq.${loc},neighborhood.eq.${loc}`).join(',');
          query = query.or(locationConditions);
        }
        
        // Bedrooms filter
        if (filters.bedrooms && filters.bedrooms.length > 0) {
          // If multiple bedroom options are selected, we need an OR condition
          if (filters.bedrooms.length > 1) {
            const bedroomConditions = filters.bedrooms.map(b => `bedrooms.eq.${b}`).join(',');
            query = query.or(bedroomConditions);
          } else {
            query = query.eq('bedrooms', filters.bedrooms[0]);
          }
        }
        
        // Construction stage filter
        if (filters.constructionStages && filters.constructionStages.length > 0) {
          query = query.in('construction_stage', filters.constructionStages);
        }
      }
      
      // Execute query with order by created_at
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching active properties:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Get property IDs to fetch images
      const propertyIds = data.map(property => property.id);
      
      // Fetch all images for these properties
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .in('property_id', propertyIds)
        .order('order', { ascending: true });
      
      if (imagesError) {
        console.error('Error fetching property images:', imagesError);
      }
      
      const imagesById = (imagesData || []).reduce((acc: Record<string, any[]>, img) => {
        if (!acc[img.property_id]) {
          acc[img.property_id] = [];
        }
        acc[img.property_id].push(mapImageFromDb(img));
        return acc;
      }, {});
      
      // Map properties with their images
      return data.map(property => mapPropertyFromDb(property, imagesById[property.id] || []));
    } catch (err) {
      console.error('Error in getAllActiveProperties:', err);
      return [];
    }
  },

  async getBrokerProperties(brokerId: string): Promise<Property[]> {
    try {
      // Fetch properties created by this broker
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('created_by_id', brokerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching broker properties:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Get property IDs to fetch images
      const propertyIds = data.map(property => property.id);
      
      // Fetch all images for these properties
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .in('property_id', propertyIds)
        .order('order', { ascending: true });
      
      if (imagesError) {
        console.error('Error fetching property images:', imagesError);
      }
      
      const imagesById = (imagesData || []).reduce((acc: Record<string, any[]>, img) => {
        if (!acc[img.property_id]) {
          acc[img.property_id] = [];
        }
        acc[img.property_id].push(mapImageFromDb(img));
        return acc;
      }, {});
      
      // Map properties with their images
      return data.map(property => mapPropertyFromDb(property, imagesById[property.id] || []));
    } catch (err) {
      console.error('Error in getBrokerProperties:', err);
      return [];
    }
  },

  async getById(propertyId: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }
      
      // Fetch images for this property
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('order', { ascending: true });
      
      if (imagesError) {
        console.error('Error fetching property images:', imagesError);
      }
      
      const images = (imagesData || []).map(img => mapImageFromDb(img));
      
      return mapPropertyFromDb(data, images);
    } catch (err) {
      console.error('Error in getById:', err);
      return null;
    }
  },

  async getAll(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Get property IDs to fetch images
      const propertyIds = data.map(property => property.id);
      
      // Fetch all images for these properties
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .in('property_id', propertyIds)
        .eq('is_main', true);
      
      if (imagesError) {
        console.error('Error fetching property images:', imagesError);
      }
      
      const imagesById = (imagesData || []).reduce((acc: Record<string, any[]>, img) => {
        if (!acc[img.property_id]) {
          acc[img.property_id] = [];
        }
        acc[img.property_id].push(mapImageFromDb(img));
        return acc;
      }, {});
      
      // Map properties with their images
      return data.map(property => mapPropertyFromDb(property, imagesById[property.id] || []));
    } catch (err) {
      console.error('Error in getAll:', err);
      return [];
    }
  }
};
