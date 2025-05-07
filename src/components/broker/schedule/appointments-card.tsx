
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentsList } from "./appointments-list";
import { Appointment } from "./appointment-item";

interface AppointmentsCardProps {
  formattedSelectedDate: string;
  filteredAppointments: Appointment[];
}

export function AppointmentsCard({ formattedSelectedDate, filteredAppointments }: AppointmentsCardProps) {
  return (
    <Card className="h-full border-cyrela-gray-lighter shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-cyrela-gray-lighter">
        <CardTitle className="text-lg">
          <span className="capitalize">
            {formattedSelectedDate}
          </span>
        </CardTitle>
        <Button size="sm" className="shadow-sm">
          <Plus className="h-4 w-4 mr-1" />
          Novo
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <AppointmentsList appointments={filteredAppointments} />
      </CardContent>
    </Card>
  );
}
