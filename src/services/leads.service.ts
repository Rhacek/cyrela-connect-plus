
import { supabase } from '@/lib/supabase';
import { Lead, LeadStatus } from '@/types';

export const leadsService = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }

    return data as unknown as Lead[];
  },

  async getById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching lead with id ${id}:`, error);
      throw error;
    }

    return data as unknown as Lead;
  },

  async create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const newLead = {
      ...lead,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(newLead)
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    return data as unknown as Lead;
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    const updatedLead = {
      ...lead,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('leads')
      .update(updatedLead)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating lead with id ${id}:`, error);
      throw error;
    }

    return data as unknown as Lead;
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating lead status with id ${id}:`, error);
      throw error;
    }

    return data as unknown as Lead;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting lead with id ${id}:`, error);
      throw error;
    }
  },

  async getBrokerLeads(brokerId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to_id', brokerId) // Fixed: changed from assignedToId to assigned_to_id
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching leads for broker ${brokerId}:`, error);
      throw error;
    }

    return data as unknown as Lead[];
  },

  async getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching leads with status ${status}:`, error);
      throw error;
    }

    return data as unknown as Lead[];
  }
};
