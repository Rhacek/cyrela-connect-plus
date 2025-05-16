
import { supabase } from '@/lib/supabase';
import { Performance } from '@/types';

export const performanceService = {
  async getCurrentMonthPerformance(brokerId: string): Promise<Performance | null> {
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    const { data, error } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId) // Fixed: changed from brokerId to broker_id
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error(`Error fetching current month performance for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as Performance;
  },

  async getMonthlyPerformance(brokerId: string, year: number): Promise<Performance[]> {
    const { data, error } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId) // Fixed: changed from brokerId to broker_id
      .eq('year', year)
      .order('month', { ascending: true });

    if (error) {
      console.error(`Error fetching monthly performance for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as Performance[];
  },

  async getYearlyPerformance(brokerId: string): Promise<any[]> {
    const { data, error } = await supabase.rpc('get_yearly_performance_summary', { broker_id: brokerId });

    if (error) {
      console.error(`Error fetching yearly performance for broker ${brokerId}:`, error);
      throw error;
    }

    return data;
  },

  async updatePerformance(brokerId: string, month: number, year: number, updates: Partial<Omit<Performance, 'id' | 'brokerId' | 'month' | 'year'>>): Promise<Performance> {
    // First check if a record exists
    const { data: existingData, error: checkError } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId) // Fixed: changed from brokerId to broker_id
      .eq('month', month)
      .eq('year', year)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`Error checking existing performance:`, checkError);
      throw checkError;
    }

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('performance')
        .update(updates)
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating performance:`, error);
        throw error;
      }

      return data as unknown as Performance;
    } else {
      // Create new record
      const newPerformance = {
        broker_id: brokerId, // Fixed: changed from brokerId to broker_id
        month,
        year,
        shares: updates.shares || 0,
        leads: updates.leads || 0,
        schedules: updates.schedules || 0,
        visits: updates.visits || 0,
        sales: updates.sales || 0,
      };

      const { data, error } = await supabase
        .from('performance')
        .insert(newPerformance)
        .select()
        .single();

      if (error) {
        console.error(`Error creating performance:`, error);
        throw error;
      }

      return data as unknown as Performance;
    }
  }
};
