
import { BarChart, LineChart } from "recharts";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  chartType: "line" | "bar";
  data: Array<any>;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  description,
  chartType,
  data,
  className,
}: ChartCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg p-5 shadow-sm border border-cyrela-gray-lighter",
      className
    )}>
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-cyrela-gray-dark">{subtitle}</p>
        )}
      </div>
      
      <div className="h-64">
        {chartType === "line" && (
          <LineChart 
            width={500} 
            height={250} 
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {/* Chart components would go here */}
          </LineChart>
        )}
        
        {chartType === "bar" && (
          <BarChart
            width={500}
            height={250}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {/* Chart components would go here */}
          </BarChart>
        )}
      </div>
      
      {description && (
        <p className="mt-4 text-xs text-cyrela-gray-dark">{description}</p>
      )}
    </div>
  );
}
