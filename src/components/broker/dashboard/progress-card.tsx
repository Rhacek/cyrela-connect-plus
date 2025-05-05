
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Performance } from "@/types";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  target: Target;
  performance: Performance;
  showActions?: boolean;
  className?: string;
}

export function ProgressCard({ 
  target, 
  performance, 
  showActions = true, 
  className 
}: ProgressCardProps) {
  // Calculate percentages
  const sharePercentage = (performance.shares / target.shareTarget) * 100;
  const leadPercentage = (performance.leads / target.leadTarget) * 100;
  const schedulePercentage = (performance.schedules / target.scheduleTarget) * 100;
  const visitPercentage = (performance.visits / target.visitTarget) * 100;
  const salePercentage = (performance.sales / target.saleTarget) * 100;
  
  // Get month name
  const getMonthName = (month: number) => {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return monthNames[month - 1];
  };
  
  return (
    <div className={cn(
      "bg-white rounded-lg p-5 shadow-sm border border-cyrela-gray-lighter",
      className
    )}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Progresso de metas</h3>
        <Badge variant="outline">
          {getMonthName(target.month)}/{target.year}
        </Badge>
      </div>
      
      <div className="mt-5 space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Compartilhamentos</span>
            <span className="font-medium">{performance.shares}/{target.shareTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full", 
                sharePercentage >= 100 ? "bg-green-500" : "bg-cyrela-blue"
              )}
              style={{ width: `${Math.min(sharePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Leads</span>
            <span className="font-medium">{performance.leads}/{target.leadTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full", 
                leadPercentage >= 100 ? "bg-green-500" : "bg-cyrela-blue"
              )}
              style={{ width: `${Math.min(leadPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Agendamentos</span>
            <span className="font-medium">{performance.schedules}/{target.scheduleTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full", 
                schedulePercentage >= 100 ? "bg-green-500" : "bg-cyrela-blue"
              )}
              style={{ width: `${Math.min(schedulePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Visitas</span>
            <span className="font-medium">{performance.visits}/{target.visitTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full", 
                visitPercentage >= 100 ? "bg-green-500" : "bg-cyrela-blue"
              )}
              style={{ width: `${Math.min(visitPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Vendas</span>
            <span className="font-medium">{performance.sales}/{target.saleTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full", 
                salePercentage >= 100 ? "bg-green-500" : "bg-living-gold"
              )}
              style={{ width: `${Math.min(salePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <Button
          className="w-full mt-5 bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
          size="sm"
        >
          Ver relatório completo
        </Button>
      )}
    </div>
  );
}
