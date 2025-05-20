import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types';
import { format, parseISO } from 'date-fns';

interface CreateAppointmentParams {
  clientId: string;
  propertyId: string;
  scheduledAt: string;
  notes?: string;
  status: string;
  brokerId?: string;
}

export const appointmentsService = {
  async create(params: CreateAppointmentParams) {
    try {
      // Garantir que a data está no formato ISO correto
      const scheduledDate = new Date(params.scheduledAt);
      
      // Criar o agendamento com a data formatada corretamente
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_id: params.clientId,
          property_id: params.propertyId,
          broker_id: params.brokerId,
          scheduled_at: scheduledDate.toISOString(), // Formato ISO para garantir consistência
          notes: params.notes,
          status: params.status,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async getByBrokerId(brokerId: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            address,
            neighborhood,
            city,
            state
          ),
          clients:client_id (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('broker_id', brokerId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Mapear os dados para o formato esperado pela aplicação
      return data.map((item) => ({
        id: item.id,
        propertyId: item.property_id,
        property: item.properties,
        clientId: item.client_id,
        client: item.clients,
        brokerId: item.broker_id,
        scheduledAt: item.scheduled_at,
        notes: item.notes,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async getByClientId(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            address,
            neighborhood,
            city,
            state
          ),
          brokers:broker_id (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('client_id', clientId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        propertyId: item.property_id,
        property: item.properties,
        clientId: item.client_id,
        brokerId: item.broker_id,
        broker: item.brokers,
        scheduledAt: item.scheduled_at,
        notes: item.notes,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            address,
            neighborhood,
            city,
            state
          ),
          clients:client_id (
            id,
            name,
            email,
            phone
          ),
          brokers:broker_id (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        propertyId: data.property_id,
        property: data.properties,
        clientId: data.client_id,
        client: data.clients,
        brokerId: data.broker_id,
        broker: data.brokers,
        scheduledAt: data.scheduled_at,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  async update(id: string, params: Partial<Appointment>) {
    try {
      // Preparar os dados para atualização
      const updateData: any = {};
      
      if (params.propertyId) updateData.property_id = params.propertyId;
      if (params.clientId) updateData.client_id = params.clientId;
      if (params.brokerId) updateData.broker_id = params.brokerId;
      if (params.notes) updateData.notes = params.notes;
      if (params.status) updateData.status = params.status;
      
      // Garantir que a data está no formato ISO correto se for fornecida
      if (params.scheduledAt) {
        const scheduledDate = new Date(params.scheduledAt);
        updateData.scheduled_at = scheduledDate.toISOString();
      }

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Função para formatar a data para exibição
  formatDate(dateString: string) {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
};
