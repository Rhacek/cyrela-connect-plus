
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyImage, PropertyStatus } from '@/types';

// Type mapper functions
const mapImageFromDb = (dbModel: any): PropertyImage => ({
  id: dbModel.id,
  propertyId: dbModel.property_id,
  url: dbModel.url,
  description: dbModel.description,
  isMain: dbModel.is_main,
  order: dbModel.order
});

const mapPropertyFromDb = (dbModel: any, images: PropertyImage[] = []): Property => ({
  id: dbModel.id,
  title: dbModel.title,
  developmentName: dbModel.development_name,
  description: dbModel.description,
  type: dbModel.type,
  price: dbModel.price,
  promotionalPrice: dbModel.promotional_price,
  area: dbModel.area,
  bedrooms: dbModel.bedrooms,
  bathrooms: dbModel.bathrooms,
  suites: dbModel.suites,
  parkingSpaces: dbModel.parking_spaces,
  address: dbModel.address,
  neighborhood: dbModel.neighborhood,
  city: dbModel.city,
  state: dbModel.state,
  zipCode: dbModel.zip_code,
  latitude: dbModel.latitude,
  longitude: dbModel.longitude,
  constructionStage: dbModel.construction_stage,
  youtubeUrl: dbModel.youtube_url,
  commission: dbModel.commission,
  brokerNotes: dbModel.broker_notes,
  createdAt: new Date(dbModel.created_at),
  updatedAt: new Date(dbModel.updated_at),
  createdById: dbModel.created_by_id,
  isActive: dbModel.is_active,
  isHighlighted: dbModel.is_highlighted,
  viewCount: dbModel.view_count,
  shareCount: dbModel.share_count,
  images: images
});

export const propertiesService = {
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
      
      const imagesById = (imagesData || []).reduce((acc: Record<string, PropertyImage[]>, img) => {
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
    return this.getProperty(propertyId);
  },

  async getProperty(propertyId: string): Promise<Property | null> {
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
      console.error('Error in getProperty:', err);
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
      
      const imagesById = (imagesData || []).reduce((acc: Record<string, PropertyImage[]>, img) => {
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
  },

  async update(propertyId: string, data: Partial<Property>): Promise<boolean> {
    try {
      // Convert camelCase to snake_case for database
      const dbData: Record<string, any> = {};
      
      if (data.title) dbData.title = data.title;
      if (data.developmentName !== undefined) dbData.development_name = data.developmentName;
      if (data.description) dbData.description = data.description;
      if (data.type) dbData.type = data.type;
      if (data.price !== undefined) dbData.price = data.price;
      if (data.promotionalPrice !== undefined) dbData.promotional_price = data.promotionalPrice;
      if (data.area !== undefined) dbData.area = data.area;
      if (data.bedrooms !== undefined) dbData.bedrooms = data.bedrooms;
      if (data.bathrooms !== undefined) dbData.bathrooms = data.bathrooms;
      if (data.suites !== undefined) dbData.suites = data.suites;
      if (data.parkingSpaces !== undefined) dbData.parking_spaces = data.parkingSpaces;
      if (data.address) dbData.address = data.address;
      if (data.neighborhood) dbData.neighborhood = data.neighborhood;
      if (data.city) dbData.city = data.city;
      if (data.state) dbData.state = data.state;
      if (data.zipCode) dbData.zip_code = data.zipCode;
      if (data.latitude !== undefined) dbData.latitude = data.latitude;
      if (data.longitude !== undefined) dbData.longitude = data.longitude;
      if (data.constructionStage !== undefined) dbData.construction_stage = data.constructionStage;
      if (data.youtubeUrl !== undefined) dbData.youtube_url = data.youtubeUrl;
      if (data.commission !== undefined) dbData.commission = data.commission;
      if (data.brokerNotes !== undefined) dbData.broker_notes = data.brokerNotes;
      if (data.isActive !== undefined) dbData.is_active = data.isActive;
      if (data.isHighlighted !== undefined) dbData.is_highlighted = data.isHighlighted;
      if (data.createdById) dbData.created_by_id = data.createdById;
      
      const { error } = await supabase
        .from('properties')
        .update(dbData)
        .eq('id', propertyId);
      
      if (error) {
        console.error('Error updating property:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in update:', err);
      return false;
    }
  },

  async create(propertyData: Partial<Property>): Promise<Property | null> {
    try {
      // Convert camelCase to snake_case for database
      const dbData: Record<string, any> = {
        title: propertyData.title || "",
        description: propertyData.description || "",
        type: propertyData.type || "",
        price: propertyData.price || 0,
        area: propertyData.area || 0,
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        suites: propertyData.suites || 0,
        parking_spaces: propertyData.parkingSpaces || 0,
        address: propertyData.address || "",
        neighborhood: propertyData.neighborhood || "",
        city: propertyData.city || "",
        state: propertyData.state || "",
        zip_code: propertyData.zipCode || "",
        created_by_id: propertyData.createdById || "",
        is_active: propertyData.isActive !== undefined ? propertyData.isActive : true,
        is_highlighted: propertyData.isHighlighted || false,
      };
      
      if (propertyData.developmentName) dbData.development_name = propertyData.developmentName;
      if (propertyData.promotionalPrice !== undefined) dbData.promotional_price = propertyData.promotionalPrice;
      if (propertyData.latitude !== undefined) dbData.latitude = propertyData.latitude;
      if (propertyData.longitude !== undefined) dbData.longitude = propertyData.longitude;
      if (propertyData.constructionStage) dbData.construction_stage = propertyData.constructionStage;
      if (propertyData.youtubeUrl) dbData.youtube_url = propertyData.youtubeUrl;
      if (propertyData.commission !== undefined) dbData.commission = propertyData.commission;
      if (propertyData.brokerNotes) dbData.broker_notes = propertyData.brokerNotes;
      
      const { data, error } = await supabase
        .from('properties')
        .insert(dbData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating property:', error);
        return null;
      }
      
      return mapPropertyFromDb(data);
    } catch (err) {
      console.error('Error in create:', err);
      return null;
    }
  },

  async delete(propertyId: string): Promise<boolean> {
    try {
      // First delete all images associated with this property
      const { error: imagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);
      
      if (imagesError) {
        console.error('Error deleting property images:', imagesError);
        return false;
      }
      
      // Then delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      
      if (error) {
        console.error('Error deleting property:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in delete:', err);
      return false;
    }
  },

  async addImage(imageData: { propertyId: string, url: string, isMain?: boolean, order?: number, description?: string }): Promise<PropertyImage | null> {
    try {
      const { propertyId, url, isMain = false, order = 0, description = '' } = imageData;
      
      const { data, error } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url,
          is_main: isMain,
          order,
          description
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding property image:', error);
        return null;
      }
      
      return mapImageFromDb(data);
    } catch (err) {
      console.error('Error in addImage:', err);
      return null;
    }
  },

  async deleteImage(imageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);
      
      if (error) {
        console.error('Error deleting property image:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in deleteImage:', err);
      return false;
    }
  }
};
