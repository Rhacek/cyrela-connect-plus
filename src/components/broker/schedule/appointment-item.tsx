
import { Clock } from "lucide-react";

export interface Appointment {
  id: string;
  title: string;
  client: string;
  date: Date;
  time: string;
  type: "visit" | "meeting" | "call";
}

interface AppointmentItemProps {
  appointment: Appointment;
}

export function AppointmentItem({ appointment }: AppointmentItemProps) {
  return (
    <div 
      className="flex items-start p-4 rounded-lg border border-cyrela-gray-lighter hover:border-primary hover:shadow-sm transition-all bg-white"
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
  );
}
