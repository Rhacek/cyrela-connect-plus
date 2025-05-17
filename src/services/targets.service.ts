
import { supabase } from '@/integrations/supabase/client';
import { Target } from '@/types';

export const targetsService = {
  async getCurrentMonthTarget(brokerId: string): Promise<Target> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const currentYear = currentDate.getFullYear();
      
      const { data, error } = await supabase
        .from('targets')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();
      
      if (error) {
        // If no target found, create one
        if (error.code === 'PGRST116') { // "No rows returned"
          return this.ensureCurrentMonthTarget(brokerId);
        }
        
        console.error('Error fetching target:', error);
        throw error;
      }
      
      return {
        id: data.id,
        brokerId: data.broker_id,
        month: data.month,
        year: data.year,
        saleTarget: data.sale_target,
        visitTarget: data.visit_target,
        scheduleTarget: data.schedule_target,
        leadTarget: data.lead_target,
        shareTarget: data.share_target
      };
    } catch (error) {
      console.error('Error in getCurrentMonthTarget:', error);
      
      // Return default empty target
      const currentDate = new Date();
      return {
        id: '',
        brokerId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        saleTarget: 0,
        visitTarget: 0,
        scheduleTarget: 0,
        leadTarget: 0,
        shareTarget: 0
      };
    }
  },
  
  async ensureCurrentMonthTarget(brokerId: string): Promise<Target> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const currentYear = currentDate.getFullYear();
      
      // Check if a record already exists
      const { data: existingData, error: queryError } = await supabase
        .from('targets')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') { // Not "No rows returned" error
        console.error('Error checking existing target:', queryError);
        throw queryError;
      }
      
      // If record exists, return it
      if (existingData) {
        return {
          id: existingData.id,
          brokerId: existingData.broker_id,
          month: existingData.month,
          year: existingData.year,
          saleTarget: existingData.sale_target,
          visitTarget: existingData.visit_target,
          scheduleTarget: existingData.schedule_target,
          leadTarget: existingData.lead_target,
          shareTarget: existingData.share_target
        };
      }
      
      // Create default targets (these can be adjusted later by the broker)
      const defaultTargets = {
        broker_id: brokerId,
        month: currentMonth,
        year: currentYear,
        sale_target: 2, // Default target of 2 sales per month
        visit_target: 10, // Default target of 10 visits per month
        schedule_target: 15, // Default target of 15 scheduled visits per month
        lead_target: 20, // Default target of 20 leads per month
        share_target: 30 // Default target of 30 shares per month
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('targets')
        .insert(defaultTargets)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating target record:', insertError);
        throw insertError;
      }
      
      return {
        id: newData.id,
        brokerId: newData.broker_id,
        month: newData.month,
        year: newData.year,
        saleTarget: newData.sale_target,
        visitTarget: newData.visit_target,
        scheduleTarget: newData.schedule_target,
        leadTarget: newData.lead_target,
        shareTarget: newData.share_target
      };
    } catch (error) {
      console.error('Error in ensureCurrentMonthTarget:', error);
      
      // Return default empty target
      const currentDate = new Date();
      return {
        id: '',
        brokerId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        saleTarget: 0,
        visitTarget: 0,
        scheduleTarget: 0,
        leadTarget: 0,
        shareTarget: 0
      };
    }
  }
};
