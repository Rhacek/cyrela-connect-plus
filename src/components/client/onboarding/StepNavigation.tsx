
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { OnboardingStep } from "./types";

interface StepNavigationProps {
  steps: OnboardingStep[];
  currentStep: number;
  completedSteps: number[];
  canNavigateToStep: (stepIndex: number) => boolean;
  navigateToStep: (stepIndex: number) => void;
}

export function StepNavigation({
  steps,
  currentStep,
  completedSteps,
  canNavigateToStep,
  navigateToStep
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mb-8 items-center">
      {steps.map((_, index) => (
        <div 
          key={index}
          onClick={() => navigateToStep(index)}
          className={cn(
            "flex flex-col items-center cursor-pointer relative",
            {
              "cursor-not-allowed opacity-60": !canNavigateToStep(index) && index !== currentStep,
              "z-10": index === currentStep
            }
          )}
        >
          <div 
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
              {
                "bg-cyrela-blue text-white": index === currentStep,
                "bg-cyrela-blue/20 text-cyrela-blue": completedSteps.includes(index) && index !== currentStep,
                "bg-cyrela-gray-lighter text-cyrela-gray-dark": !completedSteps.includes(index) && index !== currentStep
              }
            )}
          >
            {completedSteps.includes(index) ? 
              <Check className="h-4 w-4" /> : 
              (index + 1)}
          </div>
          
          {/* Line connecting steps */}
          {index < steps.length - 1 && (
            <div className="absolute h-1 w-full top-4 left-1/2 -z-10">
              <div 
                className={cn(
                  "h-1 bg-cyrela-gray-lighter absolute top-0 left-0 w-full",
                  {
                    "bg-cyrela-blue": completedSteps.includes(index) && completedSteps.includes(index + 1)
                  }
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
