
import { OnboardingFormData } from "../types";

// Check if a step is completed based on form data
export const isStepCompleted = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 0:
      return !!formData.objective;
    case 1:
      return !!formData.stage;
    case 2:
      return !!formData.city && !!formData.zone && 
             (formData.zone !== "zonasul" || formData.neighborhoods.length >= 3);
    case 3:
      return !!formData.bedrooms && !!formData.budget;
    case 4:
      return !!formData.name && !!formData.email && !!formData.phone;
    default:
      return false;
  }
};

// Check if user can navigate to a specific step
export const canNavigateToStep = (
  stepIndex: number, 
  currentStep: number, 
  completedSteps: number[]
): boolean => {
  // Always allow navigating back
  if (stepIndex < currentStep) return true;
  
  // For review step, require all previous steps to be completed
  if (stepIndex === 5) {
    return completedSteps.length >= 5;
  }
  
  // For other steps, check if previous steps are completed
  for (let i = 0; i < stepIndex; i++) {
    if (!completedSteps.includes(i)) return false;
  }
  
  return true;
};

// Check if user can advance to the next step
export const canAdvanceToNextStep = (
  currentStep: number, 
  completedSteps: number[]
): boolean => {
  if (currentStep === 5) {
    // For the review step, all previous steps must be completed
    return completedSteps.length >= 5;
  }
  
  // For other steps, check if the current step is completed
  return completedSteps.includes(currentStep);
};

// Handle auto-advance logic for different fields
export const shouldAutoAdvance = (field: string, value: any, formData: OnboardingFormData): boolean => {
  if (field === "objective" || field === "stage") {
    return true;
  }
  
  if (field === "zone" && value !== "zonasul") {
    return true;
  }
  
  if (field === "neighborhoods" && value.length >= 3) {
    return true;
  }

  if ((field === "bedrooms" && formData.budget) || 
      (field === "budget" && formData.bedrooms)) {
    return true;
  }
  
  return false;
};
