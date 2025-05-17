
import { supabase } from '@/integrations/supabase/client';
import { Performance } from '@/types';

/**
 * Gets the performance data for the current month
 */
export const getCurrentMonthPerformance = async (brokerId: string): Promise<Performance> => {
  try {
    // Get current date to determine current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();
    
    // Try to get existing performance data for current month
    const { data, error } = await supabase
      .from('performance')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
      console.error('Error fetching current month performance:', error);
      
      // If there's an actual error (not just no data), return an empty performance object
      return {
        id: '',
        brokerId,
        month: currentMonth,
        year: currentYear,
        sales: 0,
        visits: 0,
        schedules: 0,
        leads: 0,
        shares: 0
      };
    }
    
    // If we found data, return it mapped to our Performance type
    if (data) {
      return {
        id: data.id,
        brokerId: data.broker_id,
        month: data.month,
        year: data.year,
        sales: data.sales,
        visits: data.visits,
        schedules: data.schedules,
        leads: data.leads,
        shares: data.shares
      };
    }
    
    // If no data exists, create an empty record for this month
    const { data: newRecord, error: createError } = await supabase
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
    
    if (createError) {
      console.error('Error creating performance record:', createError);
      
      // If we can't create a record, return an empty object
      return {
        id: '',
        brokerId,
        month: currentMonth,
        year: currentYear,
        sales: 0,
        visits: 0,
        schedules: 0,
        leads: 0,
        shares: 0
      };
    }
    
    // Return the newly created record
    return {
      id: newRecord.id,
      brokerId: newRecord.broker_id,
      month: newRecord.month,
      year: newRecord.year,
      sales: newRecord.sales,
      visits: newRecord.visits,
      schedules: newRecord.schedules,
      leads: newRecord.leads,
      shares: newRecord.shares
    };
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
 * Gets the current lead count for a broker
 */
export const getBrokerLeadCount = async (brokerId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_to_id', brokerId);
    
    if (error) {
      console.error('Error fetching broker lead count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getBrokerLeadCount:', error);
    return 0;
  }
};

/**
 * Gets the current scheduled visits count for a broker
 */
export const getBrokerScheduledVisitsCount = async (brokerId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_to_id', brokerId)
      .eq('status', 'SCHEDULED');
    
    if (error) {
      console.error('Error fetching broker scheduled visits count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getBrokerScheduledVisitsCount:', error);
    return 0;
  }
};

/**
 * Gets the potential sales volume (VGV) for a broker
 * Calculates the sum of property prices for all leads with status INTERESTED, SCHEDULED, or VISITED
 */
export const getBrokerPotentialVGV = async (brokerId: string): Promise<number> => {
  try {
    // Get all leads with potential conversion (interested, scheduled, or visited)
    const { data: potentialLeads, error: leadsError } = await supabase
      .from('leads')
      .select('id, property_id')
      .eq('assigned_to_id', brokerId)
      .in('status', ['INTERESTED', 'SCHEDULED', 'VISITED']);
    
    if (leadsError) {
      console.error('Error fetching potential leads:', leadsError);
      return 0;
    }
    
    if (!potentialLeads || potentialLeads.length === 0) {
      return 0;
    }
    
    // Extract property IDs (filtering out null values)
    const propertyIds = potentialLeads
      .map(lead => lead.property_id)
      .filter(id => id !== null) as string[];
    
    if (propertyIds.length === 0) {
      return 0;
    }
    
    // Get total sum of property prices
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('price')
      .in('id', propertyIds);
    
    if (propertiesError) {
      console.error('Error fetching property prices:', propertiesError);
      return 0;
    }
    
    // Calculate total potential VGV
    const totalVGV = properties.reduce((sum, property) => sum + (property.price || 0), 0);
    
    return totalVGV;
  } catch (error) {
    console.error('Error in getBrokerPotentialVGV:', error);
    return 0;
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
