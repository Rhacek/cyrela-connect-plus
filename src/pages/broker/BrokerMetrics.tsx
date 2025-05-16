import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthPerformance, getMonthlyPerformance, getYearlyPerformance } from "@/services/performance";
import { targetsService } from "@/services/targets.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BrokerSidebarContent } from "@/components/broker/sidebar/broker-sidebar-content";
import { PerformanceChart } from "@/components/broker/metrics/performance-chart";
import { PerformanceTable } from "@/components/broker/metrics/performance-table";
import { PerformanceComparison } from "@/components/broker/metrics/performance-comparison";
import { PerformanceMetrics } from "@/components/broker/metrics/performance-metrics";
import { mockMonthlyPerformance, mockHistoricalPerformance } from "@/mocks/performance-data";
import { mockMonthlyTargets } from "@/mocks/target-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

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
  const performanceData = monthlyPerformance || mockMonthlyPerformance;
  const historicalData = yearlyPerformance || mockHistoricalPerformance;
  const targetData = mockMonthlyTargets; // Replace with real target data when available
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-cyrela-gray-lightest">
        <Sidebar>
          <BrokerSidebarContent />
        </Sidebar>
        
        <SidebarInset>
          <ScrollArea className="h-screen w-full">
            <div className="flex flex-col w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
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
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho Mensal {selectedYear}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PerformanceChart 
                        data={performanceData} 
                        isLoading={isLoadingMonthly}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhamento Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PerformanceTable 
                        data={performanceData} 
                        isLoading={isLoadingMonthly}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="yearly" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho Anual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PerformanceChart 
                        data={historicalData.filter(item => item.year === selectedYear)} 
                        isLoading={isLoadingYearly}
                        isYearly
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo Anual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PerformanceTable 
                        data={historicalData.filter(item => item.year === selectedYear)} 
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BrokerMetrics;
