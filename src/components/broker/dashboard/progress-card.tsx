
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Performance, Target } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressCardProps {
  performance: Performance;
  target: Target;
  className?: string;
  isLoading?: boolean;
}

export function ProgressCard({ performance, target, className, isLoading = false }: ProgressCardProps) {
  const getPercentage = (value: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((value / target) * 100));
  };
  
  const metrics = [
    { name: "Compartilhamentos", value: performance.shares, target: target.shareTarget },
    { name: "Leads", value: performance.leads, target: target.leadTarget },
    { name: "Agendamentos", value: performance.schedules, target: target.scheduleTarget },
    { name: "Visitas", value: performance.visits, target: target.visitTarget },
    { name: "Vendas", value: performance.sales, target: target.saleTarget }
  ];
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Progresso Mensal</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {metrics.map((metric, index) => {
              const percentage = getPercentage(metric.value, metric.target);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">{metric.name}</h3>
                    <span className="text-xs text-cyrela-gray-dark">
                      {metric.value} / {metric.target}
                    </span>
                  </div>
                  
                  <Progress value={percentage} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-cyrela-gray-dark">0%</span>
                    <span className="text-xs text-cyrela-gray-dark">100%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
