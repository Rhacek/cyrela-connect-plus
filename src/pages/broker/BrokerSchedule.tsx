
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/components/broker/schedule/appointment-item";
import { CalendarCard } from "@/components/broker/schedule/calendar-card";
import { AppointmentsCard } from "@/components/broker/schedule/appointments-card";

export default function BrokerSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
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

  // Filter appointments for the selected date and type
  const filteredAppointments = appointments.filter(
    appointment => {
      // Date filter
      const dateMatches = date && 
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear();
      
      // Type filter
      const typeMatches = typeFilter.length === 0 || typeFilter.includes(appointment.type);
      
      return dateMatches && typeMatches;
    }
  );

  // Format the selected date for display
  const formattedSelectedDate = date 
    ? format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Selecione uma data";

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-2xl font-bold mb-6">Minha Agenda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 lg:col-span-4">
          <CalendarCard date={date} setDate={setDate} />
        </div>
        
        <div className="md:col-span-7 lg:col-span-8">
          <AppointmentsCard 
            formattedSelectedDate={formattedSelectedDate}
            filteredAppointments={filteredAppointments}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        </div>
      </div>
    </div>
  );
}
