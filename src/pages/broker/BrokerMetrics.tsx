import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthPerformance } from "@/services/performance/performance-query.service";
import { getMonthlyPerformance, getYearlyPerformance } from "@/services/performance/performance-query.service";
import { targetsService } from "@/services/targets.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceTable } from "@/components/broker/metrics/performance-table";
import { PerformanceComparison } from "@/components/broker/metrics/performance-comparison";
import { PerformanceMetrics } from "@/components/broker/metrics/performance-metrics";
import { mockMonthlyPerformance, mockHistoricalPerformance } from "@/mocks/performance-data";
import { mockMonthlyTargets } from "@/mocks/target-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { EnhancedPerformanceChart } from "@/components/broker/metrics/enhanced-performance-chart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportPerformanceData } from "@/utils/export-utils";
import { Performance } from "@/types";

const BrokerMetrics = () => {
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
  useEffect(() => {
    if (!session?.id) {
      toast.error("Sessão não encontrada. Faça login novamente.");
    }
  }, [session]);
  
  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };
  
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
  
  const performanceData = getFormattedMonthlyPerformance();
  const historicalData = getFormattedYearlyPerformance();
  const targetData = mockMonthlyTargets; // Replace with real target data when available
  
  // Export data functions
  const handleExportMonthlyData = () => {
    exportPerformanceData.toCSV(performanceData, `desempenho-mensal-${selectedYear}.csv`);
  };
  
  const handleExportYearlyData = () => {
    exportPerformanceData.toPDF(
      historicalData, 
      `Relatório de Desempenho Anual`,
      `desempenho-anual.pdf`
    );
  };
  
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Métricas de Desempenho</h1>
          <p className="text-muted-foreground">
            Acompanhe seu desempenho e compare com suas metas.
          </p>
        </div>
        
        <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="yearly">Anual</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4 mt-4">
            <PerformanceMetrics 
              performance={currentPerformance} 
              target={currentTarget}
              isLoading={isLoadingCurrent || isLoadingTarget}
            />
            
            <EnhancedPerformanceChart 
              data={performanceData} 
              isLoading={isLoadingMonthly}
              title="Desempenho Mensal"
              description={`Visualização das métricas do ano ${selectedYear}`}
            />
            
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Detalhamento Mensal</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportMonthlyData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <PerformanceTable 
                  data={performanceData} 
                  isLoading={isLoadingMonthly}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="yearly" className="space-y-4 mt-4">
            <EnhancedPerformanceChart 
              data={historicalData} 
              isLoading={isLoadingYearly}
              isYearly
              title="Desempenho Anual"
              description="Visualização do desempenho ao longo dos anos"
            />
            
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Resumo Anual</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportYearlyData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <PerformanceTable 
                  data={historicalData.filter(item => item.year >= selectedYear - 2)} 
                  isLoading={isLoadingYearly}
                  isYearly
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo: Desempenho vs. Metas</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceComparison 
                  performanceData={performanceData} 
                  targetData={targetData}
                  isLoading={isLoadingMonthly}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default BrokerMetrics;
