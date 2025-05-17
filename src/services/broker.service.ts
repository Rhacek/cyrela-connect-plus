
import { supabase } from '@/integrations/supabase/client';
import { UserSession } from '@/types/auth';

export interface BrokerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registryNumber?: string; // CRECI
  bio?: string;
  specialties?: string;
  experience?: string;
  address?: string;
  profileImage?: string;
  brokerCode?: string;
  brokerage?: string;
  company?: string;
  city?: string;
  zone?: string;
}

export const brokerService = {
  async getBrokerProfile(brokerId: string): Promise<BrokerProfile | null> {
    try {
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
        return null;
      }
      
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
      console.error('Error in getBrokerProfile:', err);
      return null;
    }
  },
  
  async updateBrokerProfile(brokerId: string, profileData: Partial<BrokerProfile>): Promise<boolean> {
    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        creci: profileData.registryNumber,
        profile_image: profileData.profileImage,
        broker_code: profileData.brokerCode,
        brokerage: profileData.brokerage,
        company: profileData.company,
        city: profileData.city,
        zone: profileData.zone
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
      );
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', brokerId);
      
      if (error) {
        console.error('Error updating broker profile:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in updateBrokerProfile:', err);
      return false;
    }
  }
};
