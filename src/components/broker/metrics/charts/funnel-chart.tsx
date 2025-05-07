
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Performance } from "@/types";

interface FunnelChartProps {
  performance: Performance;
}

export function FunnelChart({ performance }: FunnelChartProps) {
  // Funnel data
  const funnelData = [
    { name: "Compartilhamentos", value: performance.shares },
    { name: "Leads", value: performance.leads },
    { name: "Agendamentos", value: performance.schedules },
    { name: "Visitas", value: performance.visits },
    { name: "Vendas", value: performance.sales }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Funil de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
