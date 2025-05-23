
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus } from '@/types';

// Type mapper functions
const mapFromDbModel = (dbModel: any): Lead => ({
  id: dbModel.id,
  name: dbModel.name,
  email: dbModel.email,
  phone: dbModel.phone,
  status: dbModel.status as LeadStatus,
  notes: dbModel.notes,
  source: dbModel.source,
  isManual: dbModel.is_manual,
  createdAt: new Date(dbModel.created_at),
  updatedAt: new Date(dbModel.updated_at),
  createdById: dbModel.created_by_id,
  propertyId: dbModel.property_id,
  assignedToId: dbModel.assigned_to_id,
  desiredLocation: dbModel.desired_location,
  preferredBedrooms: dbModel.preferred_bedrooms,
  preferredBathrooms: dbModel.preferred_bathrooms,
  budget: dbModel.budget,
  targetMoveDate: dbModel.target_move_date ? new Date(dbModel.target_move_date) : undefined
});

interface LeadFilters {
  name?: string;
  status?: LeadStatus | "ALL";
  fromDate?: string;
  toDate?: string;
}

export const leadsService = {
  async getBrokerLeads(brokerId: string, filters?: LeadFilters): Promise<Lead[]> {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .eq('assigned_to_id', brokerId);
      
      // Apply filters if provided
      if (filters) {
        // Filter by name (search in name, email, and phone)
        if (filters.name && filters.name.trim() !== '') {
          const searchTerm = `%${filters.name.toLowerCase()}%`;
          query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`);
        }
        
        // Filter by status
        if (filters.status && filters.status !== 'ALL') {
          query = query.eq('status', filters.status);
        }
        
        // Filter by date range
        if (filters.fromDate) {
          query = query.gte('created_at', filters.fromDate);
        }
        
        if (filters.toDate) {
          // Add one day to include the end date fully
          const nextDay = new Date(filters.toDate);
          nextDay.setDate(nextDay.getDate() + 1);
          query = query.lt('created_at', nextDay.toISOString());
        }
      }
      
      // Always sort by creation date (newest first)
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching broker leads:', error);
        throw error;
      }
      
      return data ? data.map(lead => mapFromDbModel(lead)) : [];
    } catch (err) {
      console.error('Error in getBrokerLeads:', err);
      return [];
    }
  },

  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId);
      
      if (error) {
        console.error('Error updating lead status:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in updateLeadStatus:', err);
      return false;
    }
  },

  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead | null> {
    try {
      const newLead = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        notes: lead.notes,
        source: lead.source,
        is_manual: lead.isManual,
        created_by_id: lead.createdById,
        property_id: lead.propertyId,
        assigned_to_id: lead.assignedToId,
        desired_location: lead.desiredLocation,
        preferred_bedrooms: lead.preferredBedrooms,
        preferred_bathrooms: lead.preferredBathrooms,
        budget: lead.budget,
        target_move_date: lead.targetMoveDate?.toISOString()
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(newLead)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating lead:', error);
        return null;
      }
      
      return mapFromDbModel(data);
    } catch (err) {
      console.error('Error in createLead:', err);
      return null;
    }
  }
};
