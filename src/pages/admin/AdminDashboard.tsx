
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, MessageSquare, TrendingUp } from "lucide-react";
import { useAdminDashboardData } from "@/hooks/use-admin-dashboard-data";
import { formatCurrency } from "@/lib/utils";

const AdminDashboard = () => {
  const { 
    stats, 
    isLoading, 
    propertiesGrowth, 
    brokersGrowth, 
    leadsGrowth 
  } = useAdminDashboardData();
  
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao painel de controle.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {propertiesGrowth > 0 ? `+${propertiesGrowth}` : "0"} no último mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Corretores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeAgents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {brokersGrowth > 0 ? `+${brokersGrowth}` : "0"} na última semana
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Leads Pendentes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingLeads || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {leadsGrowth > 0 ? `+${leadsGrowth}` : "0"} desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Imóveis Recentes</CardTitle>
            <CardDescription>Últimos imóveis adicionados ao sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recentProperties && stats.recentProperties.length > 0 ? (
                stats.recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                      {property.image && (
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium truncate">{property.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {property.neighborhood}, {property.city}
                      </p>
                    </div>
                    <div className="text-sm font-medium whitespace-nowrap">
                      {formatCurrency(property.price)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum imóvel cadastrado recentemente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Ações executadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center text-primary">
                      {activity.icon === 'users' && <Users size={14} />}
                      {activity.icon === 'building' && <Building size={14} />}
                      {activity.icon === 'messageSquare' && <MessageSquare size={14} />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
                          Math.round((activity.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)), 
                          'hour'
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma atividade recente
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
