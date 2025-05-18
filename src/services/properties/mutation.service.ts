
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyImage } from '@/types';
import { mapImageFromDb, mapPropertyFromDb } from './mappers';

export const mutationService = {
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

  async create(propertyData: Partial<Property>, createdById: string): Promise<Property | null> {
    try {
      // Format property data for Supabase
      const formattedData = {
        title: propertyData.title || '',
        description: propertyData.description || '',
        type: propertyData.type || '',
        price: propertyData.price || 0,
        area: propertyData.area || 0,
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        suites: propertyData.suites || 0,
        parking_spaces: propertyData.parkingSpaces || 0,
        address: propertyData.address || '',
        neighborhood: propertyData.neighborhood || '',
        city: propertyData.city || '',
        state: propertyData.state || '',
        zip_code: propertyData.zipCode || '',
        development_name: propertyData.developmentName,
        promotional_price: propertyData.promotionalPrice,
        latitude: propertyData.latitude,
        longitude: propertyData.longitude,
        construction_stage: propertyData.constructionStage,
        broker_notes: propertyData.brokerNotes,
        youtube_url: propertyData.youtubeUrl,
        commission: propertyData.commission,
        created_by_id: createdById,
        is_active: true,
        is_highlighted: propertyData.isHighlighted || false
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(formattedData)
        .select('*')
        .single();

      if (error) {
        console.error('Error creating property:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Convert to Property type
      return mapPropertyFromDb(data, []);
    } catch (err) {
      console.error('Error in create property:', err);
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
