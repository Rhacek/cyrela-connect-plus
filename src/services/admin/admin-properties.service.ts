
import { supabase } from '@/integrations/supabase/client';
import { RecentProperty } from './types';

/**
 * Gets a list of recent properties
 */
export const getRecentProperties = async (): Promise<RecentProperty[]> => {
  try {
    // Get recent properties
    const { data: recentProps, error: recentPropsError } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        neighborhood,
        city,
        price,
        property_images!inner(url, is_main)
      `)
      .eq('property_images.is_main', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (recentPropsError) throw recentPropsError;
    
    // Transform recent properties data
    return recentProps?.map(prop => ({
      id: prop.id,
      title: prop.title,
      neighborhood: prop.neighborhood,
      city: prop.city,
      price: prop.price,
      image: prop.property_images?.[0]?.url
    })) || [];
  } catch (error) {
    console.error("Error fetching recent properties:", error);
    return [];
  }
};
