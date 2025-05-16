
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Performance, Target } from "@/types";
import { ensureCurrentMonthPerformance } from "@/services/performance";
import { targetsService } from "@/services/targets.service";

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
            await targetsService.ensureCurrentMonthTarget(session.id);
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
