
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';
import { ensureCurrentMonthPerformance } from './performance-mutation.service';

/**
 * Gets the performance data for the current month
 */
export const getCurrentMonthPerformance = async (brokerId: string): Promise<Performance> => {
  try {
    // First ensure that a record exists for the current month
    const performance = await ensureCurrentMonthPerformance(brokerId);
    
    // If record creation failed, return empty performance data
    if (!performance) {
      const currentDate = new Date();
      return {
        id: '',
        brokerId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        sales: 0,
        visits: 0,
        schedules: 0,
        leads: 0,
        shares: 0
      };
    }
    
    return performance;
  } catch (error) {
    console.error('Error in getCurrentMonthPerformance:', error);
    
    // Return empty data in case of error
    const currentDate = new Date();
    return {
      id: '',
      brokerId,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      sales: 0,
      visits: 0,
      schedules: 0,
      leads: 0,
      shares: 0
    };
  }
};

/**
 * Gets the performance data for each month in the specified year
 */
export const getMonthlyPerformance = async (brokerId: string, year: number): Promise<Performance[]> => {
  try {
    const { data, error } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('year', year)
      .order('month', { ascending: true });
    
    if (error) {
      console.error('Error fetching monthly performance:', error);
      return [];
    }
    
    // Convert from snake_case to camelCase
    return (data || []).map(record => ({
      id: record.id,
      brokerId: record.broker_id,
      month: record.month,
      year: record.year,
      sales: record.sales,
      visits: record.visits,
      schedules: record.schedules,
      leads: record.leads,
      shares: record.shares
    }));
  } catch (error) {
    console.error('Error in getMonthlyPerformance:', error);
    return [];
  }
};

/**
 * Gets the performance data summarized by year
 */
export const getYearlyPerformance = async (brokerId: string): Promise<Performance[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_yearly_performance_summary', { broker_id: brokerId });
    
    if (error) {
      console.error('Error fetching yearly performance:', error);
      return [];
    }
    
    // Convert from snake_case to camelCase and from the function output format to Performance objects
    return (data || []).map(record => ({
      id: `${record.year}`, // Using year as ID since this is an aggregated record
      brokerId,
      month: 0, // 0 indicates this is a yearly summary
      year: record.year,
      sales: record.total_sales,
      visits: record.total_visits,
      schedules: record.total_schedules,
      leads: record.total_leads,
      shares: record.total_shares
    }));
  } catch (error) {
    console.error('Error in getYearlyPerformance:', error);
    return [];
  }
};
