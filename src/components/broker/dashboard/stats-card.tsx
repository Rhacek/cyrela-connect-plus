
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string | number;
  target?: string | number;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  target,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      "cyrela-card flex flex-col animate-fade-in",
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="overflow-hidden">
          <h3 className="text-sm font-medium text-cyrela-gray-dark truncate font-poppins">{title}</h3>
          <div className="mt-1 flex items-end">
            <p className="text-2xl font-semibold text-primary font-poppins">{value}</p>
            
            {trend && (
              <div className={cn(
                "ml-2 flex items-center text-xs font-medium font-inter",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-cyrela-gray-dark"
              )}>
                {trendValue}
              </div>
            )}
          </div>
        </div>
        
        {icon && (
          <div className="p-2 bg-cyrela-gray-lighter rounded-md flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
      
      {(description || target) && (
        <div className="mt-auto text-xs text-cyrela-gray-dark font-inter">
          {description && <p className="truncate mb-2">{description}</p>}
          
          {target && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="truncate pr-2">Progresso</span>
                <span className="flex-shrink-0">{value}/{target}</span>
              </div>
              <div className="w-full bg-cyrela-gray-lighter rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(Number(value) / Number(target) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
