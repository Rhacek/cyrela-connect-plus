
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CalendarCard } from "@/components/broker/schedule/calendar-card";
import { AppointmentsCard } from "@/components/broker/schedule/appointments-card";
import { useAuth } from "@/context/auth-context";
import { appointmentsService } from "@/services/appointments.service";
import { CreateAppointmentDialog } from "@/components/broker/schedule/create-appointment-dialog";

export default function BrokerSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { session } = useAuth();
  const brokerId = session?.id;
  
  // Fetch appointments data from Supabase
  const { 
    data: appointments = [],
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['brokerAppointments', brokerId],
    queryFn: () => appointmentsService.getBrokerAppointments(brokerId || ""),
    enabled: !!brokerId
  });
  
  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Não foi possível carregar os agendamentos");
    }
  }, [error]);

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

  // Handle creating a new appointment
  const handleCreateAppointment = () => {
    setIsCreateDialogOpen(true);
  };

  // Handle successful appointment creation
  const handleAppointmentCreated = () => {
    refetch();
    setIsCreateDialogOpen(false);
    toast.success("Agendamento criado com sucesso");
  };

  // Handle status update (confirmation, cancellation)
  const handleStatusUpdate = () => {
    refetch();
    toast.success("Status do agendamento atualizado com sucesso");
  };

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
          {isLoading ? (
            <div className="cyrela-card p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
                <p className="mt-2 text-cyrela-gray-dark">Carregando agendamentos...</p>
              </div>
            </div>
          ) : (
            <AppointmentsCard 
              formattedSelectedDate={formattedSelectedDate}
              filteredAppointments={filteredAppointments}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              onNewAppointment={handleCreateAppointment}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </div>

      {isCreateDialogOpen && (
        <CreateAppointmentDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onAppointmentCreated={handleAppointmentCreated}
          selectedDate={date || new Date()}
        />
      )}
    </div>
  );
}
