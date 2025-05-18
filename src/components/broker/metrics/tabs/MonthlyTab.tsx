
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Performance } from "@/types";
import { PerformanceMetrics } from "@/components/broker/metrics/performance-metrics";
import { EnhancedPerformanceChart } from "@/components/broker/metrics/enhanced-performance-chart";
import { PerformanceTable } from "@/components/broker/metrics/performance-table";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "@/types";

interface MonthlyTabProps {
  performanceData: Performance[];
  currentPerformance: Performance | null;
  currentTarget: Target | null;
  isLoadingPerformance: boolean;
  isLoadingTarget: boolean;
  selectedYear: number;
  onExportData: () => void;
}

export function MonthlyTab({
  performanceData,
  currentPerformance,
  currentTarget,
  isLoadingPerformance,
  isLoadingTarget,
  selectedYear,
  onExportData
}: MonthlyTabProps) {
  return (
    <div className="space-y-4 mt-4">
      <PerformanceMetrics 
        performance={currentPerformance} 
        target={currentTarget}
        isLoading={isLoadingPerformance || isLoadingTarget}
      />
      
      <EnhancedPerformanceChart 
        data={performanceData} 
        isLoading={isLoadingPerformance}
        title="Desempenho Mensal"
        description={`Visualização das métricas do ano ${selectedYear}`}
      />
      
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Detalhamento Mensal</CardTitle>
        <Button variant="outline" size="sm" onClick={onExportData}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <PerformanceTable 
            data={performanceData} 
            isLoading={isLoadingPerformance}
          />
        </CardContent>
      </Card>
    </div>
  );
}
