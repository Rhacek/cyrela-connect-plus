
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';
import { mapFromDbModel, mapToDbModel } from './performance-mapper.service';

/**
 * Updates or creates a performance record for a broker
 */
export const updatePerformance = async (
  brokerId: string, 
  month: number, 
  year: number, 
  updates: Partial<Omit<Performance, 'id' | 'brokerId' | 'month' | 'year'>>
): Promise<Performance> => {
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
};

/**
 * Ensures a performance record exists for the current month
 */
export const ensureCurrentMonthPerformance = async (brokerId: string): Promise<Performance> => {
  if (!brokerId) {
    throw new Error('Cannot ensure performance: No broker ID provided');
  }

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  try {
    // First check if a record exists
    const { data: existingData, error: checkError } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Error checking existing performance:`, checkError);
      throw checkError;
    }
    
    if (existingData) {
      return mapFromDbModel(existingData);
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
};
