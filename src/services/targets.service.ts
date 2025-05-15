
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
      .eq('brokerId', brokerId)
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
      .eq('brokerId', brokerId)
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
      .eq('brokerId', brokerId)
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
        brokerId,
        month,
        year,
        shareTarget: updates.shareTarget || 0,
        leadTarget: updates.leadTarget || 0,
        scheduleTarget: updates.scheduleTarget || 0,
        visitTarget: updates.visitTarget || 0,
        saleTarget: updates.saleTarget || 0,
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
