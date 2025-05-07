
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider, 
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, Plus } from "lucide-react";
import { SidebarNavigation } from "@/components/broker/sidebar/sidebar-navigation";
import { SidebarFooter as BrokerSidebarFooter } from "@/components/broker/sidebar/sidebar-footer";
import { SidebarLogo } from "@/components/broker/sidebar/sidebar-logo";

type Appointment = {
  id: string;
  title: string;
  client: string;
  date: Date;
  time: string;
  type: "visit" | "meeting" | "call";
};

export default function BrokerSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Visita ao Jardim Europa",
      client: "João Silva",
      date: new Date(),
      time: "09:30",
      type: "visit"
    },
    {
      id: "2",
      title: "Reunião de alinhamento",
      client: "Maria Oliveira",
      date: new Date(),
      time: "14:00",
      type: "meeting"
    },
    {
      id: "3",
      title: "Ligação de acompanhamento",
      client: "Carlos Santos",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "10:15",
      type: "call"
    }
  ]);

  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter(
    appointment => 
      date && 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
  );

  // Renamed from SidebarContent to BrokerSidebarContent to avoid conflict
  const BrokerSidebarContent = () => {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    
    return (
      <>
        <SidebarHeader>
          <SidebarLogo 
            isCollapsed={isCollapsed} 
            handleToggleCollapse={toggleSidebar} 
          />
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarNavigation isCollapsed={isCollapsed} />
        </SidebarContent>
        
        <SidebarFooter>
          <BrokerSidebarFooter 
            isCollapsed={isCollapsed} 
            handleToggleCollapse={toggleSidebar} 
          />
        </SidebarFooter>
      </>
    );
  };

  return (
    <SidebarProvider>
      {({ state, toggleSidebar }) => (
        <div className="flex h-screen w-full overflow-hidden bg-cyrela-gray-lightest">
          <Sidebar>
            <BrokerSidebarContent />
          </Sidebar>
          
          <SidebarInset>
            <div className="flex flex-col h-full w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Minha Agenda</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        Calendário
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">
                        {date ? (
                          <span>
                            {date.toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        ) : (
                          "Compromissos"
                        )}
                      </CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Novo
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {filteredAppointments.length === 0 ? (
                        <div className="text-center py-8 text-cyrela-gray-dark">
                          <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>Nenhum compromisso agendado para esta data</p>
                          <Button variant="outline" className="mt-4">
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar compromisso
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredAppointments
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map((appointment) => (
                              <div 
                                key={appointment.id} 
                                className="flex items-start p-4 rounded-lg border border-cyrela-gray-lighter hover:border-primary transition-colors"
                              >
                                <div className="mr-4 flex-shrink-0 flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                                  <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium">{appointment.title}</p>
                                  <p className="text-sm text-cyrela-gray-dark">
                                    Cliente: {appointment.client}
                                  </p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
