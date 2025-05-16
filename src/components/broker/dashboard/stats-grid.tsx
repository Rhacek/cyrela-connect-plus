
import { Card, CardContent } from "@/components/ui/card";
import { Performance, Target } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  performance: Performance;
  target: Target;
  className?: string;
  isLoading?: boolean;
}

export function StatsGrid({ performance, target, className, isLoading = false }: StatsGridProps) {
  const getPercentage = (value: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((value / target) * 100));
  };
  
  const stats = [
    {
      title: "Compartilhamentos",
      value: performance.shares,
      target: target.shareTarget,
      metric: "de meta"
    },
    {
      title: "Leads",
      value: performance.leads,
      target: target.leadTarget,
      metric: "de meta"
    },
    {
      title: "Agendamentos",
      value: performance.schedules,
      target: target.scheduleTarget,
      metric: "de meta"
    },
    {
      title: "Visitas",
      value: performance.visits,
      target: target.visitTarget,
      metric: "de meta"
    },
    {
      title: "Vendas",
      value: performance.sales,
      target: target.saleTarget,
      metric: "de meta"
    }
  ];
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4", className)}>
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-cyrela-gray-dark mb-1">{stat.title}</h3>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-cyrela-gray-dark ml-1">/ {stat.target}</span>
                </div>
                <div className="text-xs text-cyrela-gray-dark">
                  {getPercentage(stat.value, stat.target)}% {stat.metric}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
