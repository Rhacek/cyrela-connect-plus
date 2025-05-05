
import { useState } from "react";
import { BrokerSidebar } from "@/components/broker/dashboard/broker-sidebar";
import { StatsCard } from "@/components/broker/dashboard/stats-card";
import { ProgressCard } from "@/components/broker/dashboard/progress-card";
import { LeadCard } from "@/components/broker/dashboard/lead-card";
import { Share, Users, Calendar, Home, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadStatus } from "@/types";

const BrokerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Mock data
  const mockTarget = {
    id: "1",
    brokerId: "1",
    month: 5, // May
    year: 2025,
    shareTarget: 2600,
    leadTarget: 104,
    scheduleTarget: 8,
    visitTarget: 4,
    saleTarget: 1,
  };
  
  const mockPerformance = {
    id: "1",
    brokerId: "1",
    month: 5, // May
    year: 2025,
    shares: 857,
    leads: 45,
    schedules: 5,
    visits: 3,
    sales: 1,
  };
  
  const mockLeads = [
    {
      id: "1",
      name: "Carlos Silva",
      email: "carlos.silva@example.com",
      phone: "(11) 98765-4321",
      status: LeadStatus.NEW,
      source: "WhatsApp",
      isManual: false,
      createdAt: new Date("2025-05-04T14:30:00"),
      updatedAt: new Date("2025-05-04T14:30:00"),
      createdById: "1",
      notes: "Interessado em apartamentos na Zona Sul"
    },
    {
      id: "2",
      name: "Mariana Oliveira",
      email: "mariana.oliveira@example.com",
      phone: "(11) 91234-5678",
      status: LeadStatus.SCHEDULED,
      source: "Site",
      isManual: true,
      createdAt: new Date("2025-05-03T10:15:00"),
      updatedAt: new Date("2025-05-03T16:45:00"),
      createdById: "1",
      assignedToId: "1",
      notes: "Agendada visita para o próximo sábado"
    }
  ];
  
  return (
    <div className="flex h-screen bg-cyrela-gray-lightest">
      <BrokerSidebar />
      
      <div className="flex-1 overflow-y-auto pl-0 lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <h1 className="text-xl md:text-2xl font-bold text-cyrela-blue truncate">Dashboard</h1>
              <p className="text-cyrela-gray-dark text-sm md:text-base line-clamp-2">
                Bem-vindo de volta, Ana Silva! Aqui está o resumo do seu desempenho.
              </p>
            </div>
            
            <Button 
              className="bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white whitespace-nowrap self-start sm:self-center"
            >
              <Plus size={16} className="mr-2" />
              Cadastrar lead
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Compartilhamentos"
              value={mockPerformance.shares}
              trend="up"
              trendValue="15% ↑"
              target={mockTarget.shareTarget}
              icon={<Share size={18} className="text-cyrela-blue" />}
              className="h-full"
            />
            
            <StatsCard
              title="Leads"
              value={mockPerformance.leads}
              trend="up"
              trendValue="8% ↑"
              target={mockTarget.leadTarget}
              icon={<Users size={18} className="text-cyrela-blue" />}
              className="h-full"
            />
            
            <StatsCard
              title="Agendamentos"
              value={mockPerformance.schedules}
              trend="neutral"
              trendValue="0% ="
              target={mockTarget.scheduleTarget}
              icon={<Calendar size={18} className="text-cyrela-blue" />}
              className="h-full"
            />
            
            <StatsCard
              title="Visitas"
              value={mockPerformance.visits}
              trend="up"
              trendValue="33% ↑"
              target={mockTarget.visitTarget}
              icon={<Home size={18} className="text-cyrela-blue" />}
              className="h-full"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold">Leads recentes</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-cyrela-blue"
                    onClick={() => window.location.href = "/broker/leads"}
                  >
                    Ver todos
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {mockLeads.map(lead => (
                    <LeadCard 
                      key={lead.id} 
                      lead={lead} 
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold">Acesso rápido</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="flex justify-start p-4 h-auto bg-white text-cyrela-blue border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
                    onClick={() => window.location.href = "/broker/properties"}
                  >
                    <Search size={24} className="mr-4 flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <h3 className="font-medium text-base md:text-lg truncate">Catálogo de imóveis</h3>
                      <p className="text-cyrela-gray-dark text-xs md:text-sm line-clamp-2">
                        Explore os empreendimentos disponíveis
                      </p>
                    </div>
                  </Button>
                  
                  <Button
                    className="flex justify-start p-4 h-auto bg-white text-cyrela-blue border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
                    onClick={() => window.location.href = "/broker/share"}
                  >
                    <Share size={24} className="mr-4 flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <h3 className="font-medium text-base md:text-lg truncate">Compartilhar</h3>
                      <p className="text-cyrela-gray-dark text-xs md:text-sm line-clamp-2">
                        Gere links personalizados para clientes
                      </p>
                    </div>
                  </Button>
                  
                  <Button
                    className="flex justify-start p-4 h-auto bg-white text-cyrela-blue border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
                    onClick={() => window.location.href = "/broker/schedule"}
                  >
                    <Calendar size={24} className="mr-4 flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <h3 className="font-medium text-base md:text-lg truncate">Agendamentos</h3>
                      <p className="text-cyrela-gray-dark text-xs md:text-sm line-clamp-2">
                        Gerencie suas visitas e compromissos
                      </p>
                    </div>
                  </Button>
                  
                  <Button
                    className="flex justify-start p-4 h-auto bg-white text-cyrela-blue border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
                    onClick={() => window.location.href = "/broker/profile"}
                  >
                    <Home size={24} className="mr-4 flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <h3 className="font-medium text-base md:text-lg truncate">Meu perfil</h3>
                      <p className="text-cyrela-gray-dark text-xs md:text-sm line-clamp-2">
                        Personalize sua página pública
                      </p>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <ProgressCard 
                target={mockTarget} 
                performance={mockPerformance} 
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
