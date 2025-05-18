
import { useState } from "react";
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
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartBarIcon, ChartLineIcon, Download, FileText, FileCsv } from "lucide-react";
import { exportPerformanceData } from "@/utils/export-utils";

interface EnhancedPerformanceChartProps {
  data: any[];
  isLoading?: boolean;
  isYearly?: boolean;
  title?: string;
  description?: string;
}

export function EnhancedPerformanceChart({ 
  data, 
  isLoading = false, 
  isYearly = false,
  title = "Desempenho",
  description = "Visualização de métricas ao longo do tempo"
}: EnhancedPerformanceChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  
  // Format month names if needed
  const formattedData = isYearly ? data : data.map(item => ({
    ...item,
    formattedMonth: getMonthName(item.month)
  }));

  // Helper to get month name
  function getMonthName(monthNumber: number): string {
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    return months[monthNumber - 1];
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }
  
  const handleExportCSV = () => {
    exportPerformanceData.toCSV(data, `desempenho-${isYearly ? 'anual' : 'mensal'}.csv`);
  };
  
  const handleExportPDF = () => {
    exportPerformanceData.toPDF(
      data, 
      `Relatório de Desempenho ${isYearly ? 'Anual' : 'Mensal'}`,
      `desempenho-${isYearly ? 'anual' : 'mensal'}.pdf`
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Tabs defaultValue="bar" value={chartType} onValueChange={(value) => setChartType(value as "bar" | "line")}>
            <TabsList className="grid w-[120px] grid-cols-2">
              <TabsTrigger value="bar">
                <ChartBarIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="line">
                <ChartLineIcon className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handleExportCSV} title="Exportar CSV">
              <FileCsv className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportPDF} title="Exportar PDF">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={isYearly ? "year" : "formattedMonth"} 
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
            ) : (
              <LineChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={isYearly ? "year" : "formattedMonth"} 
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
                <Line type="monotone" dataKey="shares" name="Compartilhamentos" stroke="#3b82f6" />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#10b981" />
                <Line type="monotone" dataKey="schedules" name="Agendamentos" stroke="#f59e0b" />
                <Line type="monotone" dataKey="visits" name="Visitas" stroke="#8b5cf6" />
                <Line type="monotone" dataKey="sales" name="Vendas" stroke="#ef4444" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
