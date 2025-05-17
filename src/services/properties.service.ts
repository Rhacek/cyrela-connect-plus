
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
  }
};
