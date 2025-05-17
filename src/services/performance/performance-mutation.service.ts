
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';

/**
 * Ensures that a performance record exists for the current month for the given broker
 */
export const ensureCurrentMonthPerformance = async (brokerId: string): Promise<Performance | null> => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    
    // Check if a record already exists for the current month
    const { data: existingData, error: queryError } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') { // Not "No rows returned" error
      console.error('Error checking existing performance:', queryError);
      return null;
    }
    
    // If record exists, return it
    if (existingData) {
      return {
        id: existingData.id,
        brokerId: existingData.broker_id,
        month: existingData.month,
        year: existingData.year,
        sales: existingData.sales,
        visits: existingData.visits,
        schedules: existingData.schedules,
        leads: existingData.leads,
        shares: existingData.shares
      };
    }
    
    // Create a new record for the current month
    const { data: newData, error: insertError } = await supabase
      .from('performance')
      .insert({
        broker_id: brokerId,
        month: currentMonth,
        year: currentYear,
        sales: 0,
        visits: 0,
        schedules: 0,
        leads: 0,
        shares: 0
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating performance record:', insertError);
      return null;
    }
    
    return {
      id: newData.id,
      brokerId: newData.broker_id,
      month: newData.month,
      year: newData.year,
      sales: newData.sales,
      visits: newData.visits,
      schedules: newData.schedules,
      leads: newData.leads,
      shares: newData.shares
    };
  } catch (error) {
    console.error('Error in ensureCurrentMonthPerformance:', error);
    return null;
  }
};

/**
 * Increments a specific metric for the current month's performance
 */
export const incrementPerformanceMetric = async (
  brokerId: string,
  metric: 'sales' | 'visits' | 'schedules' | 'leads' | 'shares'
): Promise<boolean> => {
  try {
    // Ensure a record exists for the current month
    const performance = await ensureCurrentMonthPerformance(brokerId);
    
    if (!performance) {
      return false;
    }
    
    // Update the specified metric
    const updateData: Record<string, number> = {};
    updateData[metric] = performance[metric] + 1;
    
    const { error } = await supabase
      .from('performance')
      .update(updateData)
      .eq('id', performance.id);
    
    if (error) {
      console.error(`Error incrementing ${metric}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in incrementPerformanceMetric (${metric}):`, error);
    return false;
  }
};
