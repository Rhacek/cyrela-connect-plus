
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';

export const getCurrentMonthPerformance = async (brokerId: string): Promise<Performance | null> => {
  try {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    
    const { data, error } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();
    
    if (error) {
      // Check if the error is because the record doesn't exist
      if (error.code === 'PGRST116') {
        // Create a new performance record for this month
        const newPerformance: Performance = {
          id: '',
          brokerId,
          month: currentMonth,
          year: currentYear,
          shares: 0,
          leads: 0,
          schedules: 0,
          visits: 0,
          sales: 0
        };
        
        // Insert new performance record
        const { data: newData, error: insertError } = await supabase
          .from('performance')
          .insert({
            broker_id: brokerId,
            month: currentMonth,
            year: currentYear,
            shares: 0,
            leads: 0,
            schedules: 0,
            visits: 0,
            sales: 0
          })
          .select('*')
          .single();
        
        if (insertError) {
          console.error('Error creating performance record:', insertError);
          return newPerformance;
        }
        
        return {
          id: newData.id,
          brokerId: newData.broker_id,
          month: newData.month,
          year: newData.year,
          shares: newData.shares,
          leads: newData.leads,
          schedules: newData.schedules,
          visits: newData.visits,
          sales: newData.sales
        };
      }
      
      console.error('Error fetching performance:', error);
      return null;
    }
    
    return {
      id: data.id,
      brokerId: data.broker_id,
      month: data.month,
      year: data.year,
      shares: data.shares,
      leads: data.leads,
      schedules: data.schedules,
      visits: data.visits,
      sales: data.sales
    };
  } catch (err) {
    console.error('Error in getCurrentMonthPerformance:', err);
    return null;
  }
};
