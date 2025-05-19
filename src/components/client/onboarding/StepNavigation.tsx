
import { OnboardingStepData } from "./types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepNavigationProps {
  steps: OnboardingStepData[];
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
    <div className="w-full">
      <div className="hidden sm:block">
        <ol className="grid grid-cols-6 gap-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isClickable = canNavigateToStep(index);
            
            return (
              <li key={index} className="relative">
                <button
                  type="button"
                  onClick={() => isClickable && navigateToStep(index)}
                  className={cn(
                    "group flex w-full flex-col items-center",
                    isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  )}
                  disabled={!isClickable}
                >
                  <span className="flex items-center justify-center">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        isCompleted ? "bg-cyrela-blue text-white" : 
                        isCurrent ? "border-2 border-cyrela-blue text-cyrela-blue" : 
                        "border border-gray-300 text-gray-500"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </span>
                  </span>
                  <span className="mt-2 text-xs font-medium text-center">
                    {step.title}
                  </span>
                </button>
                
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-4 h-0.5 w-full -translate-x-1/2 transform",
                      isCompleted ? "bg-cyrela-blue" : "bg-gray-300"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
      
      <div className="sm:hidden">
        <p className="text-sm font-medium text-cyrela-blue">
          Passo {currentStep + 1} de {steps.length}: {steps[currentStep].title}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {steps[currentStep].description}
        </p>
      </div>
    </div>
  );
}
