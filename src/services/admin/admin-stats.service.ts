
import { supabase } from '@/integrations/supabase/client';
import { AdminStats } from './types';
import { getPropertiesGrowth, getBrokersGrowth, getLeadsGrowth } from './admin-growth.service';
import { getRecentProperties } from './admin-properties.service';
import { getRecentActivities } from './admin-activities.service';

/**
 * Fetches basic admin statistics from Supabase
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    console.log("Fetching admin dashboard statistics");
    
    // Get total properties count
    const { count: totalProperties, error: propertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    if (propertiesError) throw propertiesError;
    
    // Get active brokers count
    const { count: activeAgents, error: brokersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'BROKER');
    
    if (brokersError) throw brokersError;
    
    // Get pending leads count
    const { count: pendingLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .in('status', ['NEW', 'CONTACTED']);
    
    if (leadsError) throw leadsError;
    
    // Get recent properties
    const recentProperties = await getRecentProperties();
    
    // Get recent activities
    const recentActivities = await getRecentActivities(pendingLeads || 0);
    
    // Calculate conversion rate
    const totalLeadsQuery = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    const convertedLeadsQuery = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'CONVERTED');
    
    const totalLeads = totalLeadsQuery.count || 0;
    const convertedLeads = convertedLeadsQuery.count || 0;
    
    // Avoid division by zero
    const conversionRate = totalLeads > 0 
      ? Math.round((convertedLeads / totalLeads) * 100) 
      : 0;
    
    // Fetch growth metrics in parallel 
    const [propertiesGrowth, brokersGrowth, leadsGrowth] = await Promise.all([
      getPropertiesGrowth(),
      getBrokersGrowth(),
      getLeadsGrowth()
    ]);
    
    return {
      totalProperties: totalProperties || 0,
      activeAgents: activeAgents || 0,
      pendingLeads: pendingLeads || 0,
      conversionRate,
      propertiesGrowth,
      brokersGrowth,
      leadsGrowth,
      recentProperties,
      recentActivities
    };
    
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    // Return zeroed data in case of error
    return {
      totalProperties: 0,
      activeAgents: 0,
      pendingLeads: 0,
      conversionRate: 0,
      propertiesGrowth: 0,
      brokersGrowth: 0,
      leadsGrowth: 0,
      recentProperties: [],
      recentActivities: []
    };
  }
};
