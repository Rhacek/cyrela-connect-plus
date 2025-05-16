import { supabase } from '@/lib/supabase';
import { Target } from '@/types';

export const targetsService = {
  async getCurrentMonthTarget(brokerId: string): Promise<Target | null> {
    if (!brokerId) {
      console.error('Cannot fetch target: No broker ID provided');
      return null;
    }

    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    console.log(`Fetching target data for broker ${brokerId} (${month}/${year})`);

    try {
      const { data, error } = await supabase
        .from('targets')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('month', month)
        .eq('year', year)
        .maybeSingle(); // Use maybeSingle instead of single to prevent errors

      if (error) {
        console.error(`Error fetching current month target for broker ${brokerId}:`, error);
        throw error;
      }

      console.log('Target data from Supabase:', data);
      
      // If no data exists, return null (the hook will handle this)
      return data;
    } catch (err) {
      console.error(`Unexpected error fetching target:`, err);
      throw err;
    }
  },

  async getMonthlyTargets(brokerId: string, year: number): Promise<Target[]> {
    if (!brokerId) {
      console.error('Cannot fetch monthly targets: No broker ID provided');
      return [];
    }

    console.log(`Fetching monthly target data for broker ${brokerId} (year ${year})`);

    try {
      const { data, error } = await supabase
        .from('targets')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('year', year)
        .order('month', { ascending: true });

      if (error) {
        console.error(`Error fetching monthly targets for broker ${brokerId}:`, error);
        throw error;
      }

      console.log(`Retrieved ${data?.length || 0} monthly target records`);
      return data || [];
    } catch (err) {
      console.error(`Unexpected error in getMonthlyTargets:`, err);
      return [];
    }
  },

  async updateTarget(brokerId: string, month: number, year: number, updates: Partial<Omit<Target, 'id' | 'brokerId' | 'month' | 'year'>>): Promise<Target> {
    // First check if a record exists
    const { data: existingData, error: checkError } = await supabase
      .from('targets')
      .select('*')
      .eq('broker_id', brokerId) // Fixed: changed from brokerId to broker_id
      .eq('month', month)
      .eq('year', year)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`Error checking existing target:`, checkError);
      throw checkError;
    }

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('targets')
        .update(updates)
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating target:`, error);
        throw error;
      }

      return data as unknown as Target;
    } else {
      // Create new record
      const newTarget = {
        broker_id: brokerId, // Fixed: changed from brokerId to broker_id
        month,
        year,
        share_target: updates.shareTarget || 0,
        lead_target: updates.leadTarget || 0,
        schedule_target: updates.scheduleTarget || 0,
        visit_target: updates.visitTarget || 0,
        sale_target: updates.saleTarget || 0,
      };

      const { data, error } = await supabase
        .from('targets')
        .insert(newTarget)
        .select()
        .single();

      if (error) {
        console.error(`Error creating target:`, error);
        throw error;
      }

      return data as unknown as Target;
    }
  },

  // Helper method to create a new target record if none exists
  async ensureCurrentMonthTarget(brokerId: string): Promise<Target> {
    if (!brokerId) {
      throw new Error('Cannot ensure target: No broker ID provided');
    }

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    try {
      // First check if a record exists
      const existingData = await this.getCurrentMonthTarget(brokerId);
      
      if (existingData) {
        return existingData as Target;
      }
      
      // Create new target record with default targets
      console.log(`Creating new target record for ${brokerId} (${month}/${year})`);
      const newTarget = {
        broker_id: brokerId,
        month,
        year,
        share_target: 10, // Default reasonable targets
        lead_target: 5,
        schedule_target: 3,
        visit_target: 2,
        sale_target: 1
      };

      const { data, error } = await supabase
        .from('targets')
        .insert(newTarget)
        .select()
        .single();

      if (error) {
        console.error(`Error creating initial target:`, error);
        throw error;
      }

      return data as unknown as Target;
    } catch (err) {
      console.error(`Error in ensureCurrentMonthTarget:`, err);
      throw err;
    }
  }
};
