
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBrokerMetrics } from "@/hooks/use-broker-metrics";
import { MonthlyTab } from "@/components/broker/metrics/tabs/MonthlyTab";
import { YearlyTab } from "@/components/broker/metrics/tabs/YearlyTab";
import { ComparisonTab } from "@/components/broker/metrics/tabs/ComparisonTab";

const BrokerMetrics = () => {
  const {
    activeTab,
    setActiveTab,
    selectedYear,
    currentPerformance,
    currentTarget,
    performanceData,
    historicalData,
    targetData,
    isLoadingCurrent,
    isLoadingTarget,
    isLoadingMonthly,
    isLoadingYearly,
    handleExportMonthlyData,
    handleExportYearlyData
  } = useBrokerMetrics();
  
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
          
          <TabsContent value="monthly">
            <MonthlyTab 
              performanceData={performanceData}
              currentPerformance={currentPerformance || null}
              currentTarget={currentTarget}
              isLoadingPerformance={isLoadingCurrent}
              isLoadingTarget={isLoadingTarget}
              selectedYear={selectedYear}
              onExportData={handleExportMonthlyData}
            />
          </TabsContent>
          
          <TabsContent value="yearly">
            <YearlyTab 
              historicalData={historicalData}
              isLoadingYearly={isLoadingYearly}
              selectedYear={selectedYear}
              onExportData={handleExportYearlyData}
            />
          </TabsContent>
          
          <TabsContent value="comparison">
            <ComparisonTab 
              performanceData={performanceData}
              targetData={targetData}
              isLoadingPerformance={isLoadingMonthly}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default BrokerMetrics;
