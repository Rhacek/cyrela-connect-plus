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

export default function BrokerDashboard() {
  const { session } = useAuth();
  const brokerId = session?.id;
  
  // Fetch necessary data
  const {
    leads,
    properties,
    isLoadingLeads,
    isLoadingProperties,
    refetchLeads,
    refetchMetrics
  } = useDashboardData(brokerId);
  
  const handleLeadUpdated = () => {
    refetchLeads();
    refetchMetrics();
  };
  
  return (
    <div className="w-full">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 space-y-6">
          <StatsGrid />
          
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
          
          <ChartCard />
        </div>
      </div>
    </div>
  );
}
