
import { Building, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsGridProps {
  totalProperties: number;
  activeAgents: number;
  pendingLeads: number;
  conversionRate: number;
  propertiesGrowth: number;
  brokersGrowth: number;
  leadsGrowth: number;
}

export const StatisticsGrid = ({
  totalProperties,
  activeAgents,
  pendingLeads,
  conversionRate,
  propertiesGrowth,
  brokersGrowth,
  leadsGrowth
}: StatisticsGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total de Imóveis" 
        value={totalProperties} 
        icon={<Building className="h-4 w-4 text-muted-foreground" />}
        trend={`${propertiesGrowth > 0 ? `+${propertiesGrowth}` : "0"} no último mês`}
      />
      <StatCard 
        title="Corretores Ativos" 
        value={activeAgents} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={`${brokersGrowth > 0 ? `+${brokersGrowth}` : "0"} na última semana`}
      />
      <StatCard 
        title="Leads Pendentes" 
        value={pendingLeads} 
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
        trend={`${leadsGrowth > 0 ? `+${leadsGrowth}` : "0"} desde ontem`}
      />
      <StatCard 
        title="Conversões" 
        value={`${conversionRate}%`} 
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend="+2.5% este mês"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
};
