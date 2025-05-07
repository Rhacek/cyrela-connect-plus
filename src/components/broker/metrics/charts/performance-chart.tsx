
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Performance } from "@/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface PerformanceChartProps {
  performance: Performance;
}

export function PerformanceChart({ performance }: PerformanceChartProps) {
  const data = [
    {
      name: "Compartilhamentos",
      value: performance.shares,
    },
    {
      name: "Leads",
      value: performance.leads,
    },
    {
      name: "Agendamentos",
      value: performance.schedules,
    },
    {
      name: "Visitas",
      value: performance.visits,
    },
    {
      name: "Vendas",
      value: performance.sales,
    },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Desempenho Geral</CardTitle>
        <CardDescription>
          Visão geral das métricas de desempenho no período
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#9b87f5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
