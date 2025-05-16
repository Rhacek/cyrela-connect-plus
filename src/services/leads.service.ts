// Import the required functionalities
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus } from '@/types';

// Fix the issue with Date formatting for created_at in createLead
export const createLead = async (leadData: {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  notes?: string;
  source: string;
  isManual: boolean;
  createdById: string;
  propertyId?: string | null;
  assignedToId?: string | null;
  budget?: number | null;
  preferredBedrooms?: number | null;
  preferredBathrooms?: number | null;
  desiredLocation?: string | null;
  targetMoveDate?: Date | null;
}): Promise<Lead> => {
  try {
    // Format the dates to ISO strings for Supabase
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    
    // Convert targetMoveDate to ISO string if it exists
    const targetMoveDate = leadData.targetMoveDate ? leadData.targetMoveDate.toISOString() : null;
    
    // Map frontend model to database model
    const dbLead = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      status: leadData.status,
      notes: leadData.notes || '',
      source: leadData.source,
      is_manual: leadData.isManual,
      created_at: createdAt,  // Using string instead of Date
      updated_at: updatedAt,
      created_by_id: leadData.createdById,
      property_id: leadData.propertyId || null,
      assigned_to_id: leadData.assignedToId || null,
      budget: leadData.budget || null,
      preferred_bedrooms: leadData.preferredBedrooms || null,
      preferred_bathrooms: leadData.preferredBathrooms || null,
      desired_location: leadData.desiredLocation || null,
      target_move_date: targetMoveDate
    };
    
    // Insert the lead into the database
    const { data, error } = await supabase
      .from('leads')
      .insert(dbLead)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
    
    // Map database model to frontend model
    const newLead: Lead = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      notes: data.notes || '',
      source: data.source,
      isManual: data.is_manual,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      createdById: data.created_by_id,
      propertyId: data.property_id || null,
      assignedToId: data.assigned_to_id || null,
      budget: data.budget || null,
      preferredBedrooms: data.preferred_bedrooms || null,
      preferredBathrooms: data.preferred_bathrooms || null,
      desiredLocation: data.desired_location || null,
      targetMoveDate: data.target_move_date ? new Date(data.target_move_date) : null
    };
    
    return newLead;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

export const getBrokerLeads = async (brokerId: string): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('created_by_id', brokerId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
    
    // Map database models to frontend models
    const leads: Lead[] = data.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      notes: lead.notes || '',
      source: lead.source,
      isManual: lead.is_manual,
      createdAt: new Date(lead.created_at),
      updatedAt: new Date(lead.updated_at),
      createdById: lead.created_by_id,
      propertyId: lead.property_id || null,
      assignedToId: lead.assigned_to_id || null,
      budget: lead.budget || null,
      preferredBedrooms: lead.preferred_bedrooms || null,
      preferredBathrooms: lead.preferred_bathrooms || null,
      desiredLocation: lead.desired_location || null,
      targetMoveDate: lead.target_move_date ? new Date(lead.target_move_date) : null
    }));
    
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};
