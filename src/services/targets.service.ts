
import { supabase } from '@/integrations/supabase/client';
import { Target } from '@/types';

const mapTargetFromDb = (dbModel: any): Target => ({
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

export const targetsService = {
  /**
   * Gets the target data for the current month
   */
  async getCurrentMonthTarget(brokerId: string): Promise<Target> {
    try {
      // Get current date to determine current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = currentDate.getFullYear();
      
      // Try to get existing target data for current month
      const { data, error } = await supabase
        .from('targets')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
        console.error('Error fetching current month target:', error);
        
        // If there's an actual error (not just no data), return an empty target object
        return {
          id: '',
          brokerId,
          month: currentMonth,
          year: currentYear,
          shareTarget: 0,
          leadTarget: 0,
          scheduleTarget: 0,
          visitTarget: 0,
          saleTarget: 0
        };
      }
      
      // If we found data, return it mapped to our Target type
      if (data) {
        return mapTargetFromDb(data);
      }
      
      // If no data exists, create an empty record for this month
      const { data: newRecord, error: createError } = await supabase
        .from('targets')
        .insert({
          broker_id: brokerId,
          month: currentMonth,
          year: currentYear,
          share_target: 0,
          lead_target: 0,
          schedule_target: 0,
          visit_target: 0,
          sale_target: 0
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating target record:', createError);
        
        // If we can't create a record, return an empty object
        return {
          id: '',
          brokerId,
          month: currentMonth,
          year: currentYear,
          shareTarget: 0,
          leadTarget: 0,
          scheduleTarget: 0,
          visitTarget: 0,
          saleTarget: 0
        };
      }
      
      // Return the newly created record
      return mapTargetFromDb(newRecord);
    } catch (error) {
      console.error('Error in getCurrentMonthTarget:', error);
      
      // Return empty data in case of error
      const currentDate = new Date();
      return {
        id: '',
        brokerId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        shareTarget: 0,
        leadTarget: 0,
        scheduleTarget: 0,
        visitTarget: 0,
        saleTarget: 0
      };
    }
  },

  /**
   * Ensures a target record exists for the current month
   */
  async ensureCurrentMonthTarget(brokerId: string): Promise<Target> {
    // This functions the same as getCurrentMonthTarget, but makes it explicit that
    // we are ensuring a record exists
    return this.getCurrentMonthTarget(brokerId);
  },

  /**
   * Updates the target data for a specific month
   */
  async updateTarget(targetId: string, targetData: Partial<Target>): Promise<boolean> {
    try {
      // Convert from camelCase to snake_case for the database
      const dbData: Record<string, any> = {};
      
      if (targetData.shareTarget !== undefined) dbData.share_target = targetData.shareTarget;
      if (targetData.leadTarget !== undefined) dbData.lead_target = targetData.leadTarget;
      if (targetData.scheduleTarget !== undefined) dbData.schedule_target = targetData.scheduleTarget;
      if (targetData.visitTarget !== undefined) dbData.visit_target = targetData.visitTarget;
      if (targetData.saleTarget !== undefined) dbData.sale_target = targetData.saleTarget;
      
      const { error } = await supabase
        .from('targets')
        .update(dbData)
        .eq('id', targetId);
      
      if (error) {
        console.error('Error updating target:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateTarget:', error);
      return false;
    }
  }
};
