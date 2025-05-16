
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Performance, Target } from "@/types";
import { Share, Users, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsOverviewProps {
  performance: Performance;
  target: Target;
  isLoading?: boolean;
}

export function MetricsOverview({ performance, target, isLoading = false }: MetricsOverviewProps) {
  // Calculate completion percentages
  const metrics = [
    {
      name: "Compartilhamentos",
      value: performance.shares,
      target: target.shareTarget,
      icon: Share,
      color: "bg-blue-500"
    },
    {
      name: "Leads",
      value: performance.leads,
      target: target.leadTarget,
      icon: Users,
      color: "bg-green-500"
    },
    {
      name: "Agendamentos",
      value: performance.schedules,
      target: target.scheduleTarget,
      icon: Calendar,
      color: "bg-orange-500"
    },
    {
      name: "Visitas",
      value: performance.visits,
      target: target.visitTarget,
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      name: "Vendas",
      value: performance.sales,
      target: target.saleTarget,
      icon: TrendingDown,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {metrics.map((metric) => {
        const percentage = metric.target > 0 
          ? Math.min(100, Math.round((metric.value / metric.target) * 100))
          : 0;
        
        return (
          <Card key={metric.name} className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-md text-white", metric.color)}>
                  <metric.icon size={18} />
                </div>
                <h3 className="font-medium text-sm">{metric.name}</h3>
              </div>
              
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">
                      {metric.value.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-sm text-cyrela-gray-dark ml-1">
                      / {metric.target.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-cyrela-gray-dark text-right">
                      {percentage}% concluído
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
