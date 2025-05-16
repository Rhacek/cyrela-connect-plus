
import {
  Card,
  CardContent,
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

interface PerformanceComparisonProps {
  performanceData: any[];
  targetData: any[];
  isLoading?: boolean;
}

export function PerformanceComparison({ 
  performanceData, 
  targetData, 
  isLoading = false 
}: PerformanceComparisonProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // Map performance and target data for comparison
  const comparisonData = performanceData.map((performance) => {
    const matchingTarget = targetData.find(
      (target) => target.month === performance.month && target.year === performance.year
    ) || { 
      shareTarget: 0, 
      leadTarget: 0, 
      scheduleTarget: 0, 
      visitTarget: 0, 
      saleTarget: 0 
    };

    // Month names in Portuguese
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    
    return {
      name: months[performance.month - 1], // Adjust for 0-based array
      realShares: performance.shares,
      targetShares: matchingTarget.shareTarget,
      realLeads: performance.leads,
      targetLeads: matchingTarget.leadTarget,
      realSchedules: performance.schedules,
      targetSchedules: matchingTarget.scheduleTarget,
      realVisits: performance.visits,
      targetVisits: matchingTarget.visitTarget,
      realSales: performance.sales,
      targetSales: matchingTarget.saleTarget,
    };
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={comparisonData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="realSales" name="Vendas Realizadas" fill="#ef4444" />
          <Bar dataKey="targetSales" name="Meta de Vendas" fill="#f87171" />
          <Bar dataKey="realVisits" name="Visitas Realizadas" fill="#8b5cf6" />
          <Bar dataKey="targetVisits" name="Meta de Visitas" fill="#a78bfa" />
          <Bar dataKey="realLeads" name="Leads Gerados" fill="#10b981" />
          <Bar dataKey="targetLeads" name="Meta de Leads" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
