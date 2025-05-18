
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentsList } from "./appointments-list";
import { Appointment } from "@/types/appointment";
import { AppointmentTypeFilter } from "./appointment-type-filter";

interface AppointmentsCardProps {
  formattedSelectedDate: string;
  filteredAppointments: Appointment[];
  typeFilter: string[];
  setTypeFilter: (types: string[]) => void;
  onNewAppointment: () => void;
  onStatusUpdate: () => void;
}

export function AppointmentsCard({ 
  formattedSelectedDate, 
  filteredAppointments,
  typeFilter,
  setTypeFilter,
  onNewAppointment,
  onStatusUpdate
}: AppointmentsCardProps) {
  return (
    <Card className="h-full border-cyrela-gray-lighter shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-cyrela-gray-lighter">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            <span className="capitalize">
              {formattedSelectedDate}
            </span>
          </CardTitle>
          <AppointmentTypeFilter 
            selectedTypes={typeFilter} 
            onFilterChange={setTypeFilter} 
          />
        </div>
        <Button size="sm" className="shadow-sm" onClick={onNewAppointment}>
          <Plus className="h-4 w-4 mr-1" />
          Novo
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <AppointmentsList 
          appointments={filteredAppointments} 
          onNewAppointment={onNewAppointment}
          onStatusUpdate={onStatusUpdate}
        />
      </CardContent>
    </Card>
  );
}
