
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';

// Type mapper functions
const mapFromDbModel = (dbModel: any): Performance => ({
  id: dbModel.id,
  brokerId: dbModel.broker_id,
  month: dbModel.month,
  year: dbModel.year,
  shares: dbModel.shares,
  leads: dbModel.leads,
  schedules: dbModel.schedules,
  visits: dbModel.visits,
  sales: dbModel.sales
});

const mapToDbModel = (model: Partial<Performance>) => ({
  broker_id: model.brokerId,
  month: model.month,
  year: model.year,
  shares: model.shares,
  leads: model.leads,
  schedules: model.schedules,
  visits: model.visits,
  sales: model.sales
});

export const performanceService = {
  async getCurrentMonthPerformance(brokerId: string): Promise<Performance | null> {
    if (!brokerId) {
      console.error('Cannot fetch performance: No broker ID provided');
      return null;
    }

    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    console.log(`Fetching performance data for broker ${brokerId} (${month}/${year})`);

    try {
      const { data, error } = await supabase
        .from('performance')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('month', month)
        .eq('year', year)
        .maybeSingle(); // Use maybeSingle instead of single to prevent errors

      if (error) {
        console.error(`Error fetching current month performance for broker ${brokerId}:`, error);
        throw error;
      }

      console.log('Performance data from Supabase:', data);
      
      // If no data exists, return null (the hook will handle this)
      return data ? mapFromDbModel(data) : null;
    } catch (err) {
      console.error(`Unexpected error fetching performance:`, err);
      throw err;
    }
  },

  async getMonthlyPerformance(brokerId: string, year: number): Promise<Performance[]> {
    if (!brokerId) {
      console.error('Cannot fetch monthly performance: No broker ID provided');
      return [];
    }

    console.log(`Fetching monthly performance data for broker ${brokerId} (year ${year})`);

    try {
      const { data, error } = await supabase
        .from('performance')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('year', year)
        .order('month', { ascending: true });

      if (error) {
        console.error(`Error fetching monthly performance for broker ${brokerId}:`, error);
        throw error;
      }

      console.log(`Retrieved ${data?.length || 0} monthly performance records`);
      return data ? data.map(mapFromDbModel) : [];
    } catch (err) {
      console.error(`Unexpected error in getMonthlyPerformance:`, err);
      return [];
    }
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
      .eq('broker_id', brokerId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`Error checking existing performance:`, checkError);
      throw checkError;
    }

    const dbUpdates = {
      shares: updates.shares,
      leads: updates.leads,
      schedules: updates.schedules,
      visits: updates.visits,
      sales: updates.sales,
    };

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('performance')
        .update(dbUpdates)
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating performance:`, error);
        throw error;
      }

      return mapFromDbModel(data);
    } else {
      // Create new record
      const newPerformance = {
        broker_id: brokerId,
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

      return mapFromDbModel(data);
    }
  },

  async ensureCurrentMonthPerformance(brokerId: string): Promise<Performance> {
    if (!brokerId) {
      throw new Error('Cannot ensure performance: No broker ID provided');
    }

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    try {
      // First check if a record exists
      const existingData = await this.getCurrentMonthPerformance(brokerId);
      
      if (existingData) {
        return existingData;
      }
      
      // Create new performance record with zeros
      console.log(`Creating new performance record for ${brokerId} (${month}/${year})`);
      const newPerformance = {
        broker_id: brokerId,
        month,
        year,
        shares: 0,
        leads: 0,
        schedules: 0,
        visits: 0,
        sales: 0
      };

      const { data, error } = await supabase
        .from('performance')
        .insert(newPerformance)
        .select()
        .single();

      if (error) {
        console.error(`Error creating initial performance:`, error);
        throw error;
      }

      return mapFromDbModel(data);
    } catch (err) {
      console.error(`Error in ensureCurrentMonthPerformance:`, err);
      throw err;
    }
  }
};
