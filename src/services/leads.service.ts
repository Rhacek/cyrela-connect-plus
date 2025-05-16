import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus } from '@/types';

// Type mapper functions
const mapFromDbModel = (dbModel: any): Lead => ({
  id: dbModel.id,
  name: dbModel.name,
  email: dbModel.email,
  phone: dbModel.phone,
  status: dbModel.status as LeadStatus, // Fix: Cast to LeadStatus
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

export const leadsService = {
  async getBrokerLeads(brokerId: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to_id', brokerId)
        .order('created_at', { ascending: false });
      
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
};
