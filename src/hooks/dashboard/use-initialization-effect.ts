
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Performance, Target } from "@/types";
import { getCurrentMonthPerformance } from "@/services/performance/performance-query.service";
import { targetsService } from "@/services/targets.service";

// Helper functions to ensure data exists
const ensureCurrentMonthPerformance = async (brokerId: string): Promise<Performance | null> => {
  try {
    // Get current performance data first
    const performance = await getCurrentMonthPerformance(brokerId);
    
    // If the performance exists but has no data (all zeros), create a new record
    const hasData = Object.values(performance).some(val => 
      typeof val === 'number' && val > 0 && val !== performance.month && val !== performance.year
    );
    
    if (!hasData) {
      // Since this is just to ensure a record exists for the current month,
      // we'll use the data we got from getCurrentMonthPerformance (which creates a record if none exists)
      console.log("Ensuring performance record exists for current month");
      return performance;
    }
    
    return performance;
  } catch (error) {
    console.error("Error ensuring performance data:", error);
    return null;
  }
};

// Helper function to ensure target exists
const ensureCurrentMonthTarget = async (brokerId: string): Promise<Target | null> => {
  try {
    // Get current target data first
    const target = await targetsService.getCurrentMonthTarget(brokerId);
    
    // If the target exists but has no data (all zeros), create a new record
    const hasData = Object.values(target).some(val => 
      typeof val === 'number' && val > 0 && val !== target.month && val !== target.year
    );
    
    if (!hasData) {
      console.log("Ensuring target record exists for current month");
      return target;
    }
    
    return target;
  } catch (error) {
    console.error("Error ensuring target data:", error);
    return null;
  }
};

export const useInitializationEffect = (
  session: any,
  hasInitializedQueries: boolean,
  isLoadingPerformance: boolean,
  isLoadingTarget: boolean,
  currentPerformance: Performance,
  currentTarget: Target
) => {
  // Check if performance and target data exists, and create them if not
  useEffect(() => {
    const ensureInitialData = async () => {
      if (session?.id && hasInitializedQueries && !isLoadingPerformance && !isLoadingTarget) {
        try {
          // If currentPerformance or currentTarget are empty records (all zeros),
          // we should ensure records exist in the database for future queries
          const hasPerformanceData = Object.values(currentPerformance).some(val => 
            typeof val === 'number' && val > 0 && val !== currentPerformance.month && val !== currentPerformance.year
          );
          
          const hasTargetData = Object.values(currentTarget).some(val => 
            typeof val === 'number' && val > 0 && val !== currentTarget.month && val !== currentTarget.year
          );
          
          if (!hasPerformanceData) {
            console.log("No performance data found, ensuring record exists in database");
            await ensureCurrentMonthPerformance(session.id);
          }
          
          if (!hasTargetData) {
            console.log("No target data found, ensuring record exists in database");
            await ensureCurrentMonthTarget(session.id);
          }
          
          if (!hasPerformanceData || !hasTargetData) {
            toast.info("Dados iniciais criados. Os valores serão atualizados automaticamente com o seu uso do sistema.");
          }
        } catch (error) {
          console.error("Error ensuring initial data:", error);
        }
      }
    };
    
    ensureInitialData();
  }, [session?.id, hasInitializedQueries, isLoadingPerformance, isLoadingTarget, currentPerformance, currentTarget]);
};
