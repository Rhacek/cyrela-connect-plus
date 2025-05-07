
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";
import { AppointmentItem, Appointment } from "./appointment-item";

interface AppointmentsListProps {
  appointments: Appointment[];
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-cyrela-gray-dark">
        <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>Nenhum compromisso agendado para esta data</p>
        <Button variant="outline" className="mt-4 shadow-sm hover:shadow">
          <Plus className="h-4 w-4 mr-1" />
          Adicionar compromisso
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((appointment) => (
          <AppointmentItem key={appointment.id} appointment={appointment} />
        ))}
    </div>
  );
}
