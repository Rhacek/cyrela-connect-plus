
import { Link } from "react-router-dom";
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";
import { StatsGrid } from "@/components/broker/dashboard/stats-grid";
import { RecentLeadsSection } from "@/components/broker/dashboard/recent-leads-section";
import { PropertyCard } from "@/components/broker/dashboard/property-card";
import { ChartCard } from "@/components/broker/dashboard/chart-card";
import { QuickAccess } from "@/components/broker/dashboard/quick-access";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import { Performance, Target } from "@/types";

export default function BrokerDashboard() {
  const { session } = useAuth();
  const brokerId = session?.id;
  
  // Fetch necessary data
  const {
    leads,
    properties,
    performance,
    isLoadingLeads,
    isLoadingProperties,
    refetchLeads,
    refetchMetrics
  } = useDashboardData(brokerId);
  
  const handleLeadUpdated = () => {
    refetchLeads();
    refetchMetrics();
  };

  // Default empty performance and target objects for when data is still loading
  const defaultPerformance: Performance = {
    id: "",
    brokerId: brokerId || "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    shares: 0,
    leads: 0,
    schedules: 0,
    visits: 0,
    sales: 0
  };

  const defaultTarget: Target = {
    id: "",
    brokerId: brokerId || "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    shareTarget: 0,
    leadTarget: 0,
    scheduleTarget: 0,
    visitTarget: 0,
    saleTarget: 0
  };

  // Chart data for the performance chart
  const chartData = [
    { name: "Jan", visits: 0, sales: 0 },
    { name: "Fev", visits: 0, sales: 0 },
    { name: "Mar", visits: 0, sales: 0 },
    { name: "Abr", visits: 0, sales: 0 },
    { name: "Mai", visits: 0, sales: 0 },
    { name: "Jun", visits: 0, sales: 0 },
  ];
  
  // Get the user's name from the session metadata if available
  const userName = session?.user_metadata?.name || "";
  
  return (
    <div className="w-full">
      <DashboardHeader 
        title="Dashboard" 
        description={`Bem-vindo${userName ? ', ' + userName : ''}! Aqui está o resumo do seu desempenho.`}
        buttonLabel="Cadastrar lead"
        onButtonClick={() => console.log("Cadastrar lead clicked")}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 space-y-6">
          <StatsGrid 
            performance={performance || defaultPerformance} 
            target={defaultTarget} 
            isLoading={!performance}
          />
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-cyrela-gray-lighter">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-cyrela-gray-dark">Leads Recentes</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/broker/leads">Ver todos</Link>
              </Button>
            </div>
            
            <RecentLeadsSection 
              leads={leads} 
              isLoading={isLoadingLeads} 
              onLeadUpdated={handleLeadUpdated}
            />
          </div>
          
          <QuickAccess />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-cyrela-gray-lighter">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-cyrela-gray-dark">Imóveis Destacados</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/broker/properties">Ver todos</Link>
              </Button>
            </div>
            
            {isLoadingProperties ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <p className="text-center text-gray-500 p-4">Nenhum imóvel destacado.</p>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
          
          <ChartCard 
            title="Desempenho Mensal" 
            subtitle="Visitas e Vendas"
            chartType="bar" 
            data={chartData}
            description="Visualize o progresso de suas visitas e vendas ao longo dos últimos meses."
          />
        </div>
      </div>
    </div>
  );
}
