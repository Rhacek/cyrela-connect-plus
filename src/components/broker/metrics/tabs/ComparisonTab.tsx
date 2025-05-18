
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Performance } from "@/types";
import { PerformanceComparison } from "@/components/broker/metrics/performance-comparison";

interface ComparisonTabProps {
  performanceData: Performance[];
  targetData: any[];
  isLoadingPerformance: boolean;
}

export function ComparisonTab({
  performanceData,
  targetData,
  isLoadingPerformance
}: ComparisonTabProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Comparativo: Desempenho vs. Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceComparison 
            performanceData={performanceData} 
            targetData={targetData}
            isLoading={isLoadingPerformance}
          />
        </CardContent>
      </Card>
    </div>
  );
}
