
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types';

// Define property filter interface
export interface PropertyFilter {
  highlighted?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  city?: string;
  neighborhood?: string | string[];
  propertyType?: string | string[];
}

export const queryService = {
  async getAllActiveProperties(filters: PropertyFilter = {}): Promise<Property[]> {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('is_active', filters.isActive !== undefined ? filters.isActive : true);
      
      // Apply filters
      if (filters.highlighted !== undefined) {
        query = query.eq('is_highlighted', filters.highlighted);
      }
      
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.minBedrooms) {
        query = query.gte('bedrooms', filters.minBedrooms);
      }
      
      if (filters.maxBedrooms) {
        query = query.lte('bedrooms', filters.maxBedrooms);
      }
      
      if (filters.minBathrooms) {
        query = query.gte('bathrooms', filters.minBathrooms);
      }
      
      if (filters.maxBathrooms) {
        query = query.lte('bathrooms', filters.maxBathrooms);
      }
      
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      
      if (filters.neighborhood) {
        if (Array.isArray(filters.neighborhood)) {
          query = query.in('neighborhood', filters.neighborhood);
        } else {
          query = query.eq('neighborhood', filters.neighborhood);
        }
      }
      
      if (filters.propertyType) {
        if (Array.isArray(filters.propertyType)) {
          query = query.in('type', filters.propertyType);
        } else {
          query = query.eq('type', filters.propertyType);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
      
      // Transform DB data to match our Property interface
      return data.map((item) => ({
        id: item.id,
        title: item.title,
        developmentName: item.development_name,
        description: item.description,
        type: item.type,
        price: item.price,
        promotionalPrice: item.promotional_price,
        area: item.area,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        suites: item.suites,
        parkingSpaces: item.parking_spaces,
        address: item.address,
        neighborhood: item.neighborhood,
        city: item.city,
        state: item.state,
        zipCode: item.zip_code,
        latitude: item.latitude,
        longitude: item.longitude,
        constructionStage: item.construction_stage,
        youtubeUrl: item.youtube_url,
        
        // Broker fields
        commission: item.commission,
        brokerNotes: item.broker_notes,
        
        // System fields
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        createdById: item.created_by_id,
        isActive: item.is_active,
        isHighlighted: item.is_highlighted,
        viewCount: item.view_count,
        shareCount: item.share_count,
        
        // Related data
        images: (item.images || []).map((img: any) => ({
          id: img.id,
          propertyId: img.property_id,
          url: img.url,
          description: img.description || '',
          isMain: img.is_main,
          order: img.order
        }))
      }));
    } catch (error) {
      console.error('Error in getAllActiveProperties:', error);
      return [];
    }
  }
};
