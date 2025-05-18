
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointment';
import { format } from 'date-fns';

export const appointmentsService = {
  async getBrokerAppointments(brokerId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('broker_id', brokerId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching broker appointments:', error);
        return [];
      }

      return data.map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        client: appointment.client_name,
        date: new Date(appointment.date),
        time: appointment.time,
        type: getAppointmentType(appointment.status),
        status: appointment.status,
        notes: appointment.notes || '',
        propertyId: appointment.property_id,
        clientEmail: appointment.client_email,
        clientPhone: appointment.client_phone || '',
      }));
    } catch (err) {
      console.error('Error in getBrokerAppointments:', err);
      return [];
    }
  },

  async createAppointment(appointmentData: {
    propertyId: string;
    brokerId: string;
    clientId?: string;
    title: string;
    date: Date;
    time: string;
    notes?: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          property_id: appointmentData.propertyId,
          broker_id: appointmentData.brokerId,
          client_id: appointmentData.clientId,
          title: appointmentData.title,
          date: format(appointmentData.date, 'yyyy-MM-dd'),
          time: appointmentData.time,
          notes: appointmentData.notes,
          client_name: appointmentData.clientName,
          client_email: appointmentData.clientEmail,
          client_phone: appointmentData.clientPhone,
          status: 'AGENDADA'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (err: any) {
      console.error('Error in createAppointment:', err);
      return { success: false, error: err.message };
    }
  },

  async updateAppointmentStatus(appointmentId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('update_appointment_status', {
          appointment_id: appointmentId,
          new_status: status
        });

      if (error) {
        console.error('Error updating appointment status:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in updateAppointmentStatus:', err);
      return false;
    }
  }
};

function getAppointmentType(status: string): 'visit' | 'meeting' | 'call' {
  // Map status to appointment type for UI display
  switch (status) {
    case 'AGENDADA':
    case 'CONFIRMADA':
      return 'visit';
    case 'CANCELADA':
      return 'call';
    case 'CONCLUIDA':
      return 'meeting';
    default:
      return 'visit';
  }
}
