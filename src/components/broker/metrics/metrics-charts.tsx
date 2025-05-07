
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Performance, Target } from "@/types";
import { 
  ComparisonChart,
  TrendsChart,
  FunnelChart,
  ConversionChart
} from "./charts";

interface MetricsChartsProps {
  performance: Performance;
  target: Target;
  period: string;
}

export function MetricsCharts({ performance, target, period }: MetricsChartsProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="funnel">Funil</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison">
          <ComparisonChart performance={performance} target={target} />
        </TabsContent>
        
        <TabsContent value="trends">
          <TrendsChart period={period} />
        </TabsContent>
        
        <TabsContent value="funnel">
          <FunnelChart performance={performance} />
        </TabsContent>
        
        <TabsContent value="conversion">
          <ConversionChart performance={performance} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
