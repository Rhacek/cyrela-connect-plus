
import { supabase } from "@/integrations/supabase/client";
import { BrokerProfile } from "./broker.service";
import { UserRole } from "@/types";

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
        zone: data.zone || undefined,
        role: data.role as UserRole || UserRole.BROKER  // Garantir que temos informação de role
      };
    } catch (err) {
      console.error('Error in getPublicProfile:', err);
      return null;
    }
  },
  
  /**
   * Verifies if user has broker role (checking both metadata and profiles table)
   */
  async verifyBrokerRole(userId: string): Promise<boolean> {
    try {
      if (!userId) return false;
      
      console.log('Verifying broker role for user ID:', userId);
      
      // Get the profile from the database
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error verifying broker role:', error);
        return false;
      }
      
      if (!data) {
        console.log('No profile found for user ID:', userId);
        return false;
      }
      
      // Check if role is BROKER
      const isBroker = data.role === UserRole.BROKER;
      console.log('User broker verification result:', { userId, isBroker });
      
      return isBroker;
    } catch (err) {
      console.error('Error in verifyBrokerRole:', err);
      return false;
    }
  }
};
