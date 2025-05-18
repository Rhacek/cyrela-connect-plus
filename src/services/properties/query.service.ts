
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
  // Get all active properties with optional filters
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
  },
  
  // Get property by ID - implementing this to fix the errors
  async getById(propertyId: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('id', propertyId)
        .single();
      
      if (error) {
        console.error('Error fetching property by ID:', error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Transform DB data to match our Property interface
      return {
        id: data.id,
        title: data.title,
        developmentName: data.development_name,
        description: data.description,
        type: data.type,
        price: data.price,
        promotionalPrice: data.promotional_price,
        area: data.area,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        suites: data.suites,
        parkingSpaces: data.parking_spaces,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        latitude: data.latitude,
        longitude: data.longitude,
        constructionStage: data.construction_stage,
        youtubeUrl: data.youtube_url,
        commission: data.commission,
        brokerNotes: data.broker_notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        createdById: data.created_by_id,
        isActive: data.is_active,
        isHighlighted: data.is_highlighted,
        viewCount: data.view_count,
        shareCount: data.share_count,
        images: (data.images || []).map((img: any) => ({
          id: img.id,
          propertyId: img.property_id,
          url: img.url,
          description: img.description || '',
          isMain: img.is_main,
          order: img.order
        }))
      };
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  },
  
  // Get all properties (needed by AdminProperties.tsx)
  async getAll(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all properties:', error);
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
        commission: item.commission,
        brokerNotes: item.broker_notes,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        createdById: item.created_by_id,
        isActive: item.is_active,
        isHighlighted: item.is_highlighted,
        viewCount: item.view_count,
        shareCount: item.share_count,
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
      console.error('Error in getAll:', error);
      return [];
    }
  }
};
