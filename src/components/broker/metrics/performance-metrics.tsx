
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface PerformanceMetricsProps {
  performance: any;
  target: Target | null;
  isLoading?: boolean;
}

export function PerformanceMetrics({ 
  performance, 
  target, 
  isLoading = false 
}: PerformanceMetricsProps) {
  if (isLoading || !performance || !target) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-[80px] mb-2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-4 w-[40px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Key metrics to highlight
  const metrics = [
    {
      name: "Leads",
      value: performance.leads || 0,
      target: target.leadTarget || 0,
      color: "bg-green-500"
    },
    {
      name: "Visitas",
      value: performance.visits || 0,
      target: target.visitTarget || 0,
      color: "bg-purple-500"
    },
    {
      name: "Vendas",
      value: performance.sales || 0,
      target: target.saleTarget || 0,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric) => {
        const percentage = metric.target > 0 
          ? Math.min(100, Math.round((metric.value / metric.target) * 100))
          : 0;
          
        // Determine status icon
        let StatusIcon = Minus;
        let statusColor = "text-yellow-500";
        
        if (percentage >= 100) {
          StatusIcon = ArrowUp;
          statusColor = "text-green-500";
        } else if (percentage < 75) {
          StatusIcon = ArrowDown;
          statusColor = "text-red-500";
        }
        
        return (
          <Card key={metric.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">
                  {metric.value.toLocaleString("pt-BR")}
                </span>
                <span className="text-sm text-muted-foreground">
                  de {metric.target.toLocaleString("pt-BR")}
                </span>
              </div>
              
              <div className="mt-2">
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className={`${statusColor} flex items-center text-xs font-medium`}>
                    <StatusIcon size={12} className="mr-1" />
                    {percentage}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Meta: {percentage}% concluída
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
