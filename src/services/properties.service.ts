
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';

// Helper functions to convert between camelCase and snake_case
const toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
};

const toSnakeCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const toCamelCaseObject = (obj: any) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCaseObject(v));
  }
  
  const camelCaseObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = toCamelCase(key);
      camelCaseObj[camelCaseKey] = toCamelCaseObject(obj[key]);
    }
  }
  return camelCaseObj;
};

const toSnakeCaseObject = (obj: any) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCaseObject(v));
  }
  
  const snakeCaseObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeCaseKey = toSnakeCase(key);
      snakeCaseObj[snakeCaseKey] = toSnakeCaseObject(obj[key]);
    }
  }
  return snakeCaseObj;
};

export const propertiesService = {
  async getAll(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }

    return toCamelCaseObject(data) as Property[];
  },

  async getById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching property with id ${id}:`, error);
      throw error;
    }

    return toCamelCaseObject(data) as Property;
  },

  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'images'>): Promise<Property> {
    // Convert property from camelCase to snake_case
    const snakeCaseProperty = toSnakeCaseObject(property);
    
    // Make sure we have default values for required fields
    const newProperty = {
      ...snakeCaseProperty,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      share_count: 0,
      is_active: true,
      is_highlighted: snakeCaseProperty.is_highlighted || false,
    };

    console.log('Creating property:', newProperty);

    const { data, error } = await supabase
      .from('properties')
      .insert(newProperty)
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      throw error;
    }

    return toCamelCaseObject(data) as Property;
  },

  async update(id: string, property: Partial<Property>): Promise<Property> {
    // Convert property from camelCase to snake_case
    const snakeCaseProperty = toSnakeCaseObject(property);
    
    const updatedProperty = {
      ...snakeCaseProperty,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('properties')
      .update(updatedProperty)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating property with id ${id}:`, error);
      throw error;
    }

    return toCamelCaseObject(data) as Property;
  },

  async delete(id: string): Promise<void> {
    // First, get all images for this property to delete them from storage later
    const { data: images } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', id);

    // Delete the property (this will cascade delete the property_images entries)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting property with id ${id}:`, error);
      throw error;
    }

    // Delete images from storage if there were any
    if (images && images.length > 0) {
      // Extract filenames from URLs
      const filePaths = images.map(image => {
        const url = image.url;
        const storageUrl = supabase.storage.from('properties').getPublicUrl('').data.publicUrl;
        return url.replace(storageUrl, '');
      });

      // Delete files from storage
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('properties')
          .remove(filePaths);

        if (storageError) {
          console.error('Error deleting property images from storage:', storageError);
          // We don't throw here as the property was deleted successfully
        }
      }
    }
  },

  async getBrokerProperties(brokerId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('created_by_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching properties for broker ${brokerId}:`, error);
      throw error;
    }

    return toCamelCaseObject(data) as Property[];
  },

  async addImage(propertyImage: Omit<any, 'id'>): Promise<any> {
    const snakeCaseImage = toSnakeCaseObject(propertyImage);
    
    const { data, error } = await supabase
      .from('property_images')
      .insert(snakeCaseImage)
      .select()
      .single();

    if (error) {
      console.error('Error adding property image:', error);
      throw error;
    }

    return toCamelCaseObject(data);
  },

  async deleteImage(imageId: string): Promise<void> {
    // First get the image to find its URL
    const { data: image, error: fetchError } = await supabase
      .from('property_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      console.error(`Error fetching image with id ${imageId}:`, fetchError);
      throw fetchError;
    }

    // Delete the image from the database
    const { error } = await supabase
      .from('property_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error(`Error deleting property image with id ${imageId}:`, error);
      throw error;
    }

    // Delete the image from storage
    if (image && image.url) {
      // Extract filename from URL
      const storageUrl = supabase.storage.from('properties').getPublicUrl('').data.publicUrl;
      const filePath = image.url.replace(storageUrl, '');

      const { error: storageError } = await supabase.storage
        .from('properties')
        .remove([filePath]);

      if (storageError) {
        console.error(`Error deleting image from storage:`, storageError);
        // We don't throw here as the database record was deleted successfully
      }
    }
  },

  async incrementViewCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_property_views', { property_id: id });

    if (error) {
      console.error(`Error incrementing view count for property ${id}:`, error);
      throw error;
    }
  },

  async incrementShareCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_property_shares', { property_id: id });

    if (error) {
      console.error(`Error incrementing share count for property ${id}:`, error);
      throw error;
    }
  }
};
