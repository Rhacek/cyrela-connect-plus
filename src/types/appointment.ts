
export interface Appointment {
  id: string;
  title: string;
  client: string;
  date: Date;
  time: string;
  type: 'visit' | 'meeting' | 'call';
  status: AppointmentStatus;
  notes: string;
  propertyId: string;
  clientEmail: string;
  clientPhone: string;
}

export type AppointmentStatus = 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA';
