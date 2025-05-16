
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the monthly growth for properties
 */
export const getPropertiesGrowth = async (): Promise<number> => {
  return getMonthlyGrowth('properties');
};

/**
 * Gets the monthly growth for brokers
 */
export const getBrokersGrowth = async (): Promise<number> => {
  return getMonthlyGrowth('brokers');
};

/**
 * Gets the monthly growth for leads
 */
export const getLeadsGrowth = async (): Promise<number> => {
  return getMonthlyGrowth('leads');
};

/**
 * Gets monthly growth for a specific metric
 */
export const getMonthlyGrowth = async (metric: 'properties' | 'brokers' | 'leads'): Promise<number> => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Use type-safe table names instead of dynamically constructing them
    let table: 'properties' | 'profiles' | 'leads';
    switch (metric) {
      case 'properties':
        table = 'properties';
        break;
      case 'brokers':
        table = 'profiles';
        break;
      case 'leads':
        table = 'leads';
        break;
    }
    
    // Count items created this month
    const { count: thisMonth, error: thisMonthError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());
    
    if (thisMonthError) throw thisMonthError;
    
    // Count items created last month
    const { count: lastMonth, error: lastMonthError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfLastMonth.toISOString())
      .lt('created_at', firstDayOfMonth.toISOString());
    
    if (lastMonthError) throw lastMonthError;
    
    // Return the growth
    return thisMonth || 0;
    
  } catch (error) {
    console.error(`Error calculating ${metric} growth:`, error);
    return 0;
  }
};
