
import { supabase } from "@/lib/supabase";

export interface AdminStats {
  totalProperties: number;
  activeAgents: number;
  pendingLeads: number;
  conversionRate: number;
  recentProperties: RecentProperty[];
  recentActivities: RecentActivity[];
}

export interface RecentProperty {
  id: string;
  title: string;
  neighborhood: string;
  city: string;
  price: number;
  image?: string;
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'property' | 'lead';
  description: string;
  timestamp: Date;
  icon: 'users' | 'building' | 'messageSquare';
}

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
    const { data: recentProps, error: recentPropsError } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        neighborhood,
        city,
        price,
        property_images!inner(url, is_main)
      `)
      .eq('property_images.is_main', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (recentPropsError) throw recentPropsError;
    
    // Transform recent properties data
    const recentProperties: RecentProperty[] = recentProps?.map(prop => ({
      id: prop.id,
      title: prop.title,
      neighborhood: prop.neighborhood,
      city: prop.city,
      price: prop.price,
      image: prop.property_images?.[0]?.url
    })) || [];
    
    // Since we don't have a real activities table, let's simulate some activities
    // In a real implementation, you would fetch from an actual activities or audit log table
    const recentActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'user',
        description: 'Novo corretor cadastrado',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: 'users'
      },
      {
        id: '2',
        type: 'property',
        description: 'Imóvel atualizado: ' + (recentProperties[0]?.title || 'Propriedade recente'),
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        icon: 'building'
      },
      {
        id: '3',
        type: 'lead',
        description: `${pendingLeads || 0} novos leads recebidos`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: 'messageSquare'
      }
    ];
    
    // Calculate conversion rate (in a real scenario, this would be based on actual conversions)
    // For now, we'll use a placeholder calculation
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
    
    return {
      totalProperties: totalProperties || 0,
      activeAgents: activeAgents || 0,
      pendingLeads: pendingLeads || 0,
      conversionRate,
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
      recentProperties: [],
      recentActivities: []
    };
  }
};

// Get monthly growth for a specific metric
export const getMonthlyGrowth = async (metric: 'properties' | 'brokers' | 'leads'): Promise<number> => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    let table = '';
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
