
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';
import { mapFromDbModel } from './performance-mapper.service';

/**
 * Gets the current month's performance for a broker
 */
export const getCurrentMonthPerformance = async (brokerId: string): Promise<Performance | null> => {
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
};

/**
 * Gets all monthly performance data for a broker in a specific year
 */
export const getMonthlyPerformance = async (brokerId: string, year: number): Promise<Performance[]> => {
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
};

/**
 * Gets yearly performance summary for a broker
 */
export const getYearlyPerformance = async (brokerId: string): Promise<any[]> => {
  const { data, error } = await supabase.rpc('get_yearly_performance_summary', { broker_id: brokerId });

  if (error) {
    console.error(`Error fetching yearly performance for broker ${brokerId}:`, error);
    throw error;
  }

  return data;
};
