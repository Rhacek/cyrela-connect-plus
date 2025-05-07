
import { useState } from "react";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarInset,
} from "@/components/ui/sidebar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/components/broker/schedule/appointment-item";
import { CalendarCard } from "@/components/broker/schedule/calendar-card";
import { AppointmentsCard } from "@/components/broker/schedule/appointments-card";
import { BrokerSidebarContent } from "@/components/broker/sidebar/broker-sidebar-content";

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

  // Format the selected date for display
  const formattedSelectedDate = date 
    ? format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Selecione uma data";

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
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 lg:col-span-4">
                  <CalendarCard date={date} setDate={setDate} />
                </div>
                
                <div className="md:col-span-7 lg:col-span-8">
                  <AppointmentsCard 
                    formattedSelectedDate={formattedSelectedDate}
                    filteredAppointments={filteredAppointments}
                  />
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
