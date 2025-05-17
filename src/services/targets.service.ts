
import { supabase } from '@/integrations/supabase/client';
import { Target } from '@/types';

export const targetsService = {
  async getCurrentMonthTarget(brokerId: string): Promise<Target | null> {
    try {
      // Get current month and year
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
        // Check if the error is because the record doesn't exist
        if (error.code === 'PGRST116') {
          // Create a new target record for this month with default values
          const newTarget: Target = {
            id: '',
            brokerId,
            month: currentMonth,
            year: currentYear,
            shareTarget: 30, // Default values
            leadTarget: 10,
            scheduleTarget: 5,
            visitTarget: 3,
            saleTarget: 1
          };

          // Insert new target record
          const { data: newData, error: insertError } = await supabase
            .from('targets')
            .insert({
              broker_id: brokerId,
              month: currentMonth,
              year: currentYear,
              share_target: newTarget.shareTarget,
              lead_target: newTarget.leadTarget,
              schedule_target: newTarget.scheduleTarget,
              visit_target: newTarget.visitTarget,
              sale_target: newTarget.saleTarget
            })
            .select('*')
            .single();

          if (insertError) {
            console.error('Error creating target record:', insertError);
            return newTarget;
          }

          return {
            id: newData.id,
            brokerId: newData.broker_id,
            month: newData.month,
            year: newData.year,
            shareTarget: newData.share_target,
            leadTarget: newData.lead_target,
            scheduleTarget: newData.schedule_target,
            visitTarget: newData.visit_target,
            saleTarget: newData.sale_target
          };
        }

        console.error('Error fetching target:', error);
        return null;
      }

      return {
        id: data.id,
        brokerId: data.broker_id,
        month: data.month,
        year: data.year,
        shareTarget: data.share_target,
        leadTarget: data.lead_target,
        scheduleTarget: data.schedule_target,
        visitTarget: data.visit_target,
        saleTarget: data.sale_target
      };
    } catch (err) {
      console.error('Error in getCurrentMonthTarget:', err);
      return null;
    }
  }
};
