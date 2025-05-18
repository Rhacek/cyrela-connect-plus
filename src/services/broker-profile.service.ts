
import { supabase } from "@/integrations/supabase/client";
import { BrokerProfile } from "./broker.service";

export const brokerProfileService = {
  /**
   * Fetches broker profile by ID (for public display)
   */
  async getPublicProfile(brokerId: string): Promise<BrokerProfile | null> {
    try {
      console.log('Fetching broker profile data for ID:', brokerId);
      
      if (!brokerId) {
        console.error('No broker ID provided');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', brokerId)
        .single();
      
      if (error) {
        console.error('Error fetching broker profile:', error);
        return null;
      }
      
      if (!data) {
        console.log('No broker profile found for ID:', brokerId);
        return null;
      }
      
      console.log('Broker profile data retrieved:', data);
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        registryNumber: data.creci || undefined,
        profileImage: data.profile_image || undefined,
        brokerCode: data.broker_code || undefined,
        brokerage: data.brokerage || undefined,
        company: data.company || undefined,
        city: data.city || undefined,
        zone: data.zone || undefined
      };
    } catch (err) {
      console.error('Error in getPublicProfile:', err);
      return null;
    }
  }
};
