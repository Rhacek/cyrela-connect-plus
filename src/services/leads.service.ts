
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus } from '@/types';

// Type mapper function to convert between our frontend model and database model
const mapToDbModel = (lead: Partial<Lead>) => {
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    notes: lead.notes,
    source: lead.source,
    is_manual: lead.isManual,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    created_by_id: lead.createdById,
    assigned_to_id: lead.assignedToId,
    property_id: lead.propertyId,
    budget: lead.budget,
    desired_location: lead.desiredLocation,
    preferred_bedrooms: lead.preferredBedrooms,
    preferred_bathrooms: lead.preferredBathrooms,
    target_move_date: lead.targetMoveDate ? new Date(lead.targetMoveDate).toISOString() : null
  };
};

// Type mapper function to convert from database model to our frontend model
const mapFromDbModel = (dbLead: any): Lead => {
  return {
    id: dbLead.id,
    name: dbLead.name,
    email: dbLead.email,
    phone: dbLead.phone,
    status: dbLead.status as LeadStatus,
    notes: dbLead.notes,
    source: dbLead.source,
    isManual: dbLead.is_manual,
    createdAt: dbLead.created_at,
    updatedAt: dbLead.updated_at,
    createdById: dbLead.created_by_id,
    assignedToId: dbLead.assigned_to_id,
    propertyId: dbLead.property_id,
    budget: dbLead.budget,
    desiredLocation: dbLead.desired_location,
    preferredBedrooms: dbLead.preferred_bedrooms,
    preferredBathrooms: dbLead.preferred_bathrooms,
    targetMoveDate: dbLead.target_move_date
  };
};

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

    return data.map(mapFromDbModel);
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

    return data ? mapFromDbModel(data) : null;
  },

  async create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const now = new Date().toISOString();
    
    const dbLead = {
      ...mapToDbModel(lead),
      created_at: now,
      updated_at: now,
      created_by_id: lead.createdById,
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(dbLead)
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    return mapFromDbModel(data);
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    const dbLead = {
      ...mapToDbModel(lead),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('leads')
      .update(dbLead)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating lead with id ${id}:`, error);
      throw error;
    }

    return mapFromDbModel(data);
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

    return mapFromDbModel(data);
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
      .eq('assigned_to_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching leads for broker ${brokerId}:`, error);
      throw error;
    }

    return data.map(mapFromDbModel);
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

    return data.map(mapFromDbModel);
  }
};
