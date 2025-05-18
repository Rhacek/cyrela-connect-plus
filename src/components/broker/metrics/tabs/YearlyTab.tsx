
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Performance } from "@/types";
import { EnhancedPerformanceChart } from "@/components/broker/metrics/enhanced-performance-chart";
import { PerformanceTable } from "@/components/broker/metrics/performance-table";
import { Card, CardContent } from "@/components/ui/card";

interface YearlyTabProps {
  historicalData: Performance[];
  isLoadingYearly: boolean;
  selectedYear: number;
  onExportData: () => void;
}

export function YearlyTab({
  historicalData,
  isLoadingYearly,
  selectedYear,
  onExportData
}: YearlyTabProps) {
  return (
    <div className="space-y-4 mt-4">
      <EnhancedPerformanceChart 
        data={historicalData} 
        isLoading={isLoadingYearly}
        isYearly
        title="Desempenho Anual"
        description="Visualização do desempenho ao longo dos anos"
      />
      
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Resumo Anual</CardTitle>
        <Button variant="outline" size="sm" onClick={onExportData}>
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
    </div>
  );
}
