
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';

export const propertiesService = {
  async getAll(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }

    return data as unknown as Property[];
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

    return data as unknown as Property;
  },

  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'images'>): Promise<Property> {
    const newProperty = {
      ...property,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(newProperty)
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      throw error;
    }

    return data as unknown as Property;
  },

  async update(id: string, property: Partial<Property>): Promise<Property> {
    const updatedProperty = {
      ...property,
      updatedAt: new Date().toISOString(),
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

    return data as unknown as Property;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting property with id ${id}:`, error);
      throw error;
    }
  },

  async getBrokerProperties(brokerId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('createdById', brokerId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error(`Error fetching properties for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as Property[];
  },

  async addImage(propertyImage: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('property_images')
      .insert(propertyImage)
      .select()
      .single();

    if (error) {
      console.error('Error adding property image:', error);
      throw error;
    }

    return data;
  },

  async deleteImage(imageId: string): Promise<void> {
    const { error } = await supabase
      .from('property_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error(`Error deleting property image with id ${imageId}:`, error);
      throw error;
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
