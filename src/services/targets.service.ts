import { supabase } from '@/integrations/supabase/client';
import { Target } from '@/types';

// Type mapper functions
const mapFromDbModel = (dbModel: any): Target => ({
  id: dbModel.id,
  brokerId: dbModel.broker_id,
  month: dbModel.month,
  year: dbModel.year,
  shareTarget: dbModel.share_target,
  leadTarget: dbModel.lead_target,
  scheduleTarget: dbModel.schedule_target,
  visitTarget: dbModel.visit_target,
  saleTarget: dbModel.sale_target
});

const mapToDbModel = (model: Partial<Target>) => ({
  broker_id: model.brokerId,
  month: model.month,
  year: model.year,
  share_target: model.shareTarget,
  lead_target: model.leadTarget,
  schedule_target: model.scheduleTarget,
  visit_target: model.visitTarget,
  sale_target: model.saleTarget
});

export const targetsService = {
  async getCurrentMonthTarget(brokerId: string): Promise<Target | null> {
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    const { data, error } = await supabase
      .from('targets')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching current month target for broker ${brokerId}:`, error);
      throw error;
    }

    return data ? mapFromDbModel(data) : null;
  },

  async getMonthlyTargets(brokerId: string, year: number): Promise<Target[]> {
    const { data, error } = await supabase
      .from('targets')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('year', year)
      .order('month', { ascending: true });

    if (error) {
      console.error(`Error fetching monthly targets for broker ${brokerId}:`, error);
      throw error;
    }

    return data ? data.map(mapFromDbModel) : [];
  },

  async updateTarget(
    brokerId: string, 
    month: number, 
    year: number, 
    updates: Partial<Omit<Target, 'id' | 'month' | 'year' | 'brokerId'>>
  ): Promise<Target> {
    // Convert frontend model to database model
    const dbUpdates = {
      share_target: updates.shareTarget,
      lead_target: updates.leadTarget,
      schedule_target: updates.scheduleTarget,
      visit_target: updates.visitTarget,
      sale_target: updates.saleTarget
    };

    // First check if a record exists
    const { data: existingData, error: checkError } = await supabase
      .from('targets')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`Error checking existing target:`, checkError);
      throw checkError;
    }

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('targets')
        .update(dbUpdates)
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating target:`, error);
        throw error;
      }

      return mapFromDbModel(data);
    } else {
      // Create new record
      const newTarget = {
        broker_id: brokerId,
        month,
        year,
        share_target: updates.shareTarget || 0,
        lead_target: updates.leadTarget || 0,
        schedule_target: updates.scheduleTarget || 0,
        visit_target: updates.visitTarget || 0,
        sale_target: updates.saleTarget || 0
      };

      const { data, error } = await supabase
        .from('targets')
        .insert(newTarget)
        .select()
        .single();

      if (error) {
        console.error(`Error creating target:`, error);
        throw error;
      }

      return mapFromDbModel(data);
    }
  }
};
