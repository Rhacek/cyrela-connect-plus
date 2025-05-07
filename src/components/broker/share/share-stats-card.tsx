
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShareStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

export function ShareStatsCard({ title, value, icon, description, trend }: ShareStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-poppins">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-poppins">{value}</div>
        {description && <p className="text-xs text-muted-foreground font-inter">{description}</p>}
        {trend && (
          <div className="flex items-center mt-1">
            <span className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1 font-inter">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
