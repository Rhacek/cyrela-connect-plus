
export type AppointmentStatus = 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA';

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

// For insert/update operations
export type AppointmentInput = Partial<Omit<Appointment, 'id'>> & {
  propertyId: string;
  date: Date;
  time: string;
  title: string;
  client: string;
  clientEmail: string;
  status?: AppointmentStatus;
};
