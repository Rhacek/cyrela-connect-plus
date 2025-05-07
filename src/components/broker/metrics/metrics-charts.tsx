
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Performance, Target } from "@/types";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
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

interface MetricsChartsProps {
  performance: Performance;
  target: Target;
  period: string;
}

export function MetricsCharts({ performance, target, period }: MetricsChartsProps) {
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

  // Funnel data
  const funnelData = [
    { name: "Compartilhamentos", value: performance.shares },
    { name: "Leads", value: performance.leads },
    { name: "Agendamentos", value: performance.schedules },
    { name: "Visitas", value: performance.visits },
    { name: "Vendas", value: performance.sales }
  ];

  // Conversion rates
  const conversionRates = [
    { 
      name: "Compartilhamentos → Leads", 
      rate: Math.round((performance.leads / performance.shares) * 100)
    },
    { 
      name: "Leads → Agendamentos", 
      rate: Math.round((performance.schedules / performance.leads) * 100) 
    },
    { 
      name: "Agendamentos → Visitas", 
      rate: Math.round((performance.visits / performance.schedules) * 100) 
    },
    { 
      name: "Visitas → Vendas", 
      rate: Math.round((performance.sales / performance.visits) * 100) 
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="funnel">Funil</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison">
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
        </TabsContent>
        
        <TabsContent value="trends">
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
        </TabsContent>
        
        <TabsContent value="funnel">
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
        </TabsContent>
        
        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Taxas de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionRates.map((item) => (
                  <Card key={item.name} className="bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{item.rate}%</span>
                        <span className="text-xs text-cyrela-gray-dark mb-1">taxa de conversão</span>
                      </div>
                      <Progress value={item.rate} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
