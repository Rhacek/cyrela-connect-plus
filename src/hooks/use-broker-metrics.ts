import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { 
  getCurrentMonthPerformance,
  getMonthlyPerformance, 
  getYearlyPerformance 
} from "@/services/performance/performance-query.service";
import { targetsService } from "@/services/targets.service";
import { Performance } from "@/types";
import { mockMonthlyPerformance, mockHistoricalPerformance } from "@/mocks/performance-data";
import { mockMonthlyTargets } from "@/mocks/target-data";
import { toast } from "@/hooks/use-toast";
import { exportPerformanceData } from "@/utils/export-utils";

export const useBrokerMetrics = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Get current month's performance
  const { data: currentPerformance, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['currentPerformance', session?.id],
    queryFn: () => getCurrentMonthPerformance(session?.id || ""),
    enabled: !!session?.id,
  });
  
  // Get monthly performance for selected year
  const { data: monthlyPerformance, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['monthlyPerformance', session?.id, selectedYear],
    queryFn: () => getMonthlyPerformance(session?.id || "", selectedYear),
    enabled: !!session?.id,
  });
  
  // Get yearly performance summary
  const { data: yearlyPerformance, isLoading: isLoadingYearly } = useQuery({
    queryKey: ['yearlyPerformance', session?.id],
    queryFn: () => getYearlyPerformance(session?.id || ""),
    enabled: !!session?.id,
  });
  
  // Get current month's target
  const { data: currentTarget, isLoading: isLoadingTarget } = useQuery({
    queryKey: ['currentTarget', session?.id],
    queryFn: () => targetsService.getCurrentMonthTarget(session?.id || ""),
    enabled: !!session?.id,
  });

  // Handle errors
  if (!session?.id) {
    toast.error("Sessão não encontrada. Faça login novamente.");
  }
  
  // Use real data or fallback to mock data
  const getFormattedMonthlyPerformance = (): Performance[] => {
    const mockData = mockMonthlyPerformance;
    
    // If we have real data from the API, use it
    if (monthlyPerformance) {
      return monthlyPerformance;
    }
    
    // Otherwise, transform the mock data to match the Performance type
    const brokerId = session?.id || "broker1";
    const currentYear = new Date().getFullYear();
    
    return mockData.map((item, index) => ({
      id: `mock-perf-${index}`,
      brokerId: brokerId,
      year: currentYear,
      month: index + 1, // Assuming months are 1-indexed in the mock data
      shares: item.shares,
      leads: item.leads,
      schedules: item.schedules,
      visits: item.visits,
      sales: item.sales
    }));
  };
  
  const getFormattedYearlyPerformance = (): Performance[] => {
    const mockData = mockHistoricalPerformance;
    
    // If we have real data from the API, use it
    if (yearlyPerformance) {
      return yearlyPerformance;
    }
    
    // Create a set of unique years from the mock data
    const uniqueYears = [...new Set(mockData.map(item => item.year))];
    const brokerId = session?.id || "broker1";
    
    // For each year, aggregate the data
    return uniqueYears.map(year => {
      const yearData = mockData.filter(item => item.year === year);
      
      return {
        id: `mock-yearly-${year}`,
        brokerId: brokerId,
        year: year,
        month: 0, // Set to 0 for yearly data
        shares: yearData.reduce((sum, item) => sum + item.shares, 0),
        leads: yearData.reduce((sum, item) => sum + item.leads, 0),
        schedules: yearData.reduce((sum, item) => sum + item.schedules, 0),
        visits: yearData.reduce((sum, item) => sum + item.visits, 0),
        sales: yearData.reduce((sum, item) => sum + item.sales, 0)
      };
    });
  };

  // Export data functions
  const handleExportMonthlyData = () => {
    const performanceData = getFormattedMonthlyPerformance();
    exportPerformanceData.toCSV(performanceData, `desempenho-mensal-${selectedYear}.csv`);
  };
  
  const handleExportYearlyData = () => {
    const historicalData = getFormattedYearlyPerformance();
    exportPerformanceData.toPDF(
      historicalData, 
      `Relatório de Desempenho Anual`,
      `desempenho-anual.pdf`
    );
  };
  
  const performanceData = getFormattedMonthlyPerformance();
  const historicalData = getFormattedYearlyPerformance();
  const targetData = mockMonthlyTargets; // Replace with real target data when available
  
  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return {
    activeTab,
    setActiveTab,
    selectedYear,
    handleYearChange,
    currentPerformance,
    currentTarget,
    performanceData,
    historicalData,
    targetData,
    isLoadingCurrent,
    isLoadingMonthly,
    isLoadingYearly,
    isLoadingTarget,
    handleExportMonthlyData,
    handleExportYearlyData
  };
};
