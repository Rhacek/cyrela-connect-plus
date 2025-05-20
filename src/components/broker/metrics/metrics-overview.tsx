import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { performanceService } from "@/services/performance.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, Users, Home, Calendar } from "lucide-react";

export function MetricsOverview() {
  const { session } = useAuth();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!session?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await performanceService.getBrokerMetrics(session.id, period);
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("Não foi possível carregar as métricas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Atualizar métricas a cada 5 minutos
    const intervalId = setInterval(fetchMetrics, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [session?.id, period]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Leads</CardDescription>
            <Skeleton className="h-7 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitas</CardDescription>
            <Skeleton className="h-7 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vendas</CardDescription>
            <Skeleton className="h-7 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Desempenho</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );

  const renderError = () => (
    <Card>
      <CardHeader>
        <CardTitle>Erro</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{error}</p>
      </CardContent>
    </Card>
  );

  if (error) return renderError();
  if (loading || !metrics) return renderSkeleton();

  const { leads, visits, sales, performance } = metrics;
  
  // Preparar dados para o gráfico
  const chartData = performance.map((item: any) => ({
    name: item.label,
    leads: item.leads,
    visits: item.visits,
    sales: item.sales,
  }));

  return (
    <div className="space-y-4">
      <Tabs defaultValue={period} onValueChange={(v) => setPeriod(v as "week" | "month" | "year")}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="week" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Leads"
              value={leads.current}
              previousValue={leads.previous}
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Visitas"
              value={visits.current}
              previousValue={visits.previous}
              icon={<Calendar className="h-4 w-4" />}
            />
            <MetricCard
              title="Vendas"
              value={sales.current}
              previousValue={sales.previous}
              prefix={formatCurrency(sales.current)}
              suffix=""
              icon={<Home className="h-4 w-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                  <Bar dataKey="visits" fill="#82ca9d" name="Visitas" />
                  <Bar dataKey="sales" fill="#ffc658" name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Leads"
              value={leads.current}
              previousValue={leads.previous}
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Visitas"
              value={visits.current}
              previousValue={visits.previous}
              icon={<Calendar className="h-4 w-4" />}
            />
            <MetricCard
              title="Vendas"
              value={sales.current}
              previousValue={sales.previous}
              prefix={formatCurrency(sales.current)}
              suffix=""
              icon={<Home className="h-4 w-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                  <Bar dataKey="visits" fill="#82ca9d" name="Visitas" />
                  <Bar dataKey="sales" fill="#ffc658" name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Leads"
              value={leads.current}
              previousValue={leads.previous}
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Visitas"
              value={visits.current}
              previousValue={visits.previous}
              icon={<Calendar className="h-4 w-4" />}
            />
            <MetricCard
              title="Vendas"
              value={sales.current}
              previousValue={sales.previous}
              prefix={formatCurrency(sales.current)}
              suffix=""
              icon={<Home className="h-4 w-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                  <Bar dataKey="visits" fill="#82ca9d" name="Visitas" />
                  <Bar dataKey="sales" fill="#ffc658" name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  previousValue: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
}

function MetricCard({
  title,
  value,
  previousValue,
  prefix = "",
  suffix = "",
  icon,
}: MetricCardProps) {
  const percentageChange = getPercentageChange(value, previousValue);
  const isPositive = percentageChange >= 0;

  function getPercentageChange(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="flex items-center">
          {icon && <span className="mr-1">{icon}</span>}
          {title}
        </CardDescription>
        {prefix ? (
          <CardTitle>{prefix}</CardTitle>
        ) : (
          <CardTitle>{value}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          {isPositive ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
          )}
          <span className={isPositive ? "text-emerald-500" : "text-rose-500"}>
            {isPositive ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
          <span className="ml-1">vs. período anterior</span>
        </div>
      </CardContent>
    </Card>
  );
}
