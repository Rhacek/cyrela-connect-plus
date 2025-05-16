
import { useState, useEffect } from 'react';
import { getAdminStats, getMonthlyGrowth, AdminStats } from '@/services/admin.service';
import { toast } from '@/hooks/use-toast';

interface AdminDashboardData {
  stats: AdminStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  propertiesGrowth: number;
  brokersGrowth: number;
  leadsGrowth: number;
}

export function useAdminDashboardData(): AdminDashboardData {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [propertiesGrowth, setPropertiesGrowth] = useState<number>(0);
  const [brokersGrowth, setBrokersGrowth] = useState<number>(0);
  const [leadsGrowth, setLeadsGrowth] = useState<number>(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch main statistics
      const adminStats = await getAdminStats();
      setStats(adminStats);
      
      // Fetch growth statistics in parallel
      const [propGrowth, brokerGrowth, leadGrowth] = await Promise.all([
        getMonthlyGrowth('properties'),
        getMonthlyGrowth('brokers'),
        getMonthlyGrowth('leads')
      ]);
      
      setPropertiesGrowth(propGrowth);
      setBrokersGrowth(brokerGrowth);
      setLeadsGrowth(leadGrowth);
      
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching dashboard data'));
      toast.error("Erro ao carregar dados do dashboard", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
    
    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const refetch = async () => {
    await fetchData();
  };

  return {
    stats: { 
      ...stats,
      propertiesGrowth,
      brokersGrowth,
      leadsGrowth
    } as AdminStats | null,
    isLoading,
    error,
    refetch,
    propertiesGrowth,
    brokersGrowth,
    leadsGrowth
  };
}
