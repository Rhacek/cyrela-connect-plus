
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface StepContainerProps {
  isLoading: boolean;
  loadingProgress: number;
  children: ReactNode;
}

export function StepContainer({ 
  isLoading, 
  loadingProgress, 
  children 
}: StepContainerProps) {
  return (
    <>
      {/* Loading indicator */}
      {isLoading && (
        <div className="my-4 animate-fade-in">
          <Progress value={loadingProgress} className="h-1" />
        </div>
      )}
      
      {/* Step content with animation */}
      <div className={cn("transition-all duration-300", 
        isLoading ? "opacity-50 pointer-events-none" : "animate-fade-in")}>
        {children}
      </div>
    </>
  );
}
