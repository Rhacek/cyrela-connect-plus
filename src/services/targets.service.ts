
import { supabase } from '@/lib/supabase';
import { Target } from '@/types';

export const targetsService = {
  async getCurrentMonthTarget(brokerId: string): Promise<Target | null> {
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    const { data, error } = await supabase
      .from('targets')
      .select('*')
      .eq('broker_id', brokerId) // Fixed: changed from brokerId to broker_id
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error(`Error fetching current month target for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as Target;
  },

  async getMonthlyTargets(brokerId: string, year: number): Promise<Target[]> {
    const { data, error } = await supabase
      .from('targets')
      .select('*')
      .eq('broker_id', brokerId) // Fixed: changed from brokerId to broker_id
      .eq('year', year)
      .order('month', { ascending: true });

    if (error) {
      console.error(`Error fetching monthly targets for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as Target[];
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
  }
};
