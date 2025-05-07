
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Performance, Target } from "@/types";

interface ComparisonChartProps {
  performance: Performance;
  target: Target;
}

export function ComparisonChart({ performance, target }: ComparisonChartProps) {
  // Performance vs Target data for bar chart
  const comparisonData = [
    {
      name: "Compartilhamentos",
      atual: performance.shares,
      meta: target.shareTarget,
      percentagem: Math.round((performance.shares / target.shareTarget) * 100)
    },
    {
      name: "Leads",
      atual: performance.leads,
      meta: target.leadTarget,
      percentagem: Math.round((performance.leads / target.leadTarget) * 100)
    },
    {
      name: "Agendamentos",
      atual: performance.schedules,
      meta: target.scheduleTarget,
      percentagem: Math.round((performance.schedules / target.scheduleTarget) * 100)
    },
    {
      name: "Visitas",
      atual: performance.visits,
      meta: target.visitTarget,
      percentagem: Math.round((performance.visits / target.visitTarget) * 100)
    },
    {
      name: "Vendas",
      atual: performance.sales,
      meta: target.saleTarget,
      percentagem: Math.round((performance.sales / target.saleTarget) * 100)
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Desempenho vs. Meta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="atual" fill="#4f46e5" name="Atual" />
              <Bar dataKey="meta" fill="#94a3b8" name="Meta" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
