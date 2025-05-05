
import { useState } from "react";
import { BrokerSidebar } from "@/components/broker/dashboard/broker-sidebar";
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";
import { StatsGrid } from "@/components/broker/dashboard/stats-grid";
import { RecentLeadsSection } from "@/components/broker/dashboard/recent-leads-section";
import { QuickAccess } from "@/components/broker/dashboard/quick-access";
import { ProgressCard } from "@/components/broker/dashboard/progress-card";
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
  
  const handleAddLead = () => {
    // Function to handle adding a new lead
    console.log("Add lead button clicked");
    // Redirect or open modal logic would go here
  };
  
  return (
    <div className="flex h-screen bg-cyrela-gray-lightest">
      <BrokerSidebar />
      
      <div className="flex-1 overflow-y-auto pl-0 lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <DashboardHeader 
            title="Dashboard" 
            description="Bem-vindo de volta, Ana Silva! Aqui está o resumo do seu desempenho."
            buttonLabel="Cadastrar lead"
            onButtonClick={handleAddLead}
          />
          
          <StatsGrid performance={mockPerformance} target={mockTarget} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentLeadsSection leads={mockLeads} />
              
              <QuickAccess />
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
