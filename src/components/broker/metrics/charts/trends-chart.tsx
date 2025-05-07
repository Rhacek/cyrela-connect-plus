
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { mockMonthlyPerformance, mockWeeklyPerformance } from "@/mocks/performance-data";

interface TrendsChartProps {
  period: string;
}

export function TrendsChart({ period }: TrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Tendências de Desempenho
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={period === "current_month" ? mockWeeklyPerformance : mockMonthlyPerformance}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={period === "current_month" ? "week" : "month"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="shares" stroke="#3b82f6" name="Compartilhamentos" />
              <Line type="monotone" dataKey="leads" stroke="#10b981" name="Leads" />
              <Line type="monotone" dataKey="schedules" stroke="#f59e0b" name="Agendamentos" />
              <Line type="monotone" dataKey="visits" stroke="#8b5cf6" name="Visitas" />
              <Line type="monotone" dataKey="sales" stroke="#ef4444" name="Vendas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
