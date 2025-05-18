
import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { StepNavigation } from "./StepNavigation";
import { NavigationButtons } from "./NavigationButtons";
import { useFormContext } from "./context/FormContext";
import { steps } from "./steps";

interface FormControllerProps {
  onSubmit: (formData: any) => void;
}

export function FormController({ onSubmit }: FormControllerProps) {
  const { 
    currentStep, 
    completedSteps, 
    isLoading,
    formData,
    handleNext
  } = useFormContext();

  const handleSubmitClick = () => {
    const result = handleNext();
    if (result && typeof onSubmit === 'function') {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <StepNavigation />
      
      <StepContainer>
        {steps.map((Step, index) => (
          <div key={index} className={index === currentStep ? "block" : "hidden"}>
            <Step />
          </div>
        ))}
      </StepContainer>
      
      <NavigationButtons onSubmit={handleSubmitClick} />
    </div>
  );
}
