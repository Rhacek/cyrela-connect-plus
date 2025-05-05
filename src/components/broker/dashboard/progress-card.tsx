
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
      "cyrela-card animate-fade-in p-3 sm:p-4 flex flex-col",
      className
    )}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base font-medium font-poppins truncate">Progresso de metas</h3>
        <Badge variant="outline" className="shrink-0 font-inter text-xs">
          {getMonthName(target.month)}/{target.year}
        </Badge>
      </div>
      
      <div className="space-y-3 sm:space-y-4 flex-grow overflow-auto">
        <div>
          <div className="flex justify-between mb-1 text-xs font-inter">
            <span className="truncate pr-2">Compartilhamentos</span>
            <span className="shrink-0 font-medium">{performance.shares}/{target.shareTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-1.5 sm:h-2">
            <div
              className={cn(
                "h-1.5 sm:h-2 rounded-full", 
                sharePercentage >= 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${Math.min(sharePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-xs font-inter">
            <span className="truncate pr-2">Leads</span>
            <span className="shrink-0 font-medium">{performance.leads}/{target.leadTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-1.5 sm:h-2">
            <div
              className={cn(
                "h-1.5 sm:h-2 rounded-full", 
                leadPercentage >= 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${Math.min(leadPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-xs font-inter">
            <span className="truncate pr-2">Agendamentos</span>
            <span className="shrink-0 font-medium">{performance.schedules}/{target.scheduleTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-1.5 sm:h-2">
            <div
              className={cn(
                "h-1.5 sm:h-2 rounded-full", 
                schedulePercentage >= 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${Math.min(schedulePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-xs font-inter">
            <span className="truncate pr-2">Visitas</span>
            <span className="shrink-0 font-medium">{performance.visits}/{target.visitTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-1.5 sm:h-2">
            <div
              className={cn(
                "h-1.5 sm:h-2 rounded-full", 
                visitPercentage >= 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${Math.min(visitPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-xs font-inter">
            <span className="truncate pr-2">Vendas</span>
            <span className="shrink-0 font-medium">{performance.sales}/{target.saleTarget}</span>
          </div>
          <div className="w-full bg-cyrela-gray-lighter rounded-full h-1.5 sm:h-2">
            <div
              className={cn(
                "h-1.5 sm:h-2 rounded-full", 
                salePercentage >= 100 ? "bg-green-500" : "bg-living-gold"
              )}
              style={{ width: `${Math.min(salePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <Button
          className="w-full mt-auto sm:mt-4 cyrela-button-primary font-inter text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
          size="sm"
        >
          Ver relatório completo
        </Button>
      )}
    </div>
  );
}
