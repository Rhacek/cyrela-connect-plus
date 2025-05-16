
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceChartProps {
  data: any[];
  isLoading?: boolean;
  isYearly?: boolean;
}

export function PerformanceChart({ data, isLoading = false, isYearly = false }: PerformanceChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={isYearly ? "year" : "month"} 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="shares" name="Compartilhamentos" fill="#3b82f6" />
          <Bar dataKey="leads" name="Leads" fill="#10b981" />
          <Bar dataKey="schedules" name="Agendamentos" fill="#f59e0b" />
          <Bar dataKey="visits" name="Visitas" fill="#8b5cf6" />
          <Bar dataKey="sales" name="Vendas" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
