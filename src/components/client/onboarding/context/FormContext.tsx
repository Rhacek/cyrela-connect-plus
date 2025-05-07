
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { OnboardingFormData } from "../types";
import { FormContextProps } from "./formTypes";
import { isStepCompleted, canNavigateToStep, canAdvanceToNextStep, shouldAutoAdvance } from "./formUtils";
import { useLoadingEffect } from "./useLoadingEffect";

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { isLoading, setIsLoading, loadingProgress, setLoadingProgress } = useLoadingEffect();
  const [formData, setFormData] = useState<OnboardingFormData>({
    objective: "",
    stage: "",
    city: "",
    zone: "",
    neighborhoods: [],
    bedrooms: "",
    budget: "",
    name: "",
    email: "",
    phone: ""
  });

  // Check if current step is completed
  useEffect(() => {
    if (isStepCompleted(currentStep, formData) && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  }, [formData, currentStep, completedSteps]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Check if we should auto-advance
    if (shouldAutoAdvance(field, value, formData)) {
      // Show loading indicator before advancing
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsLoading(false);
      }, 400);
    }
  };

  const handleNext = () => {
    const totalSteps = 6; // Total number of steps
    
    if (currentStep < totalSteps - 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsLoading(false);
      }, 400);
    } else {
      // Submit the form
      setIsLoading(true);
      setTimeout(() => {
        console.log("Form submitted:", formData);
        // Redirect to results
        window.location.href = "/client/results";
      }, 600);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsLoading(false);
      }, 400);
    }
  };

  const handleNavigateToStep = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex, currentStep, completedSteps)) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsLoading(false);
      }, 400);
    }
  };

  return (
    <FormContext.Provider value={{
      currentStep,
      setCurrentStep,
      completedSteps,
      setCompletedSteps,
      isLoading,
      setIsLoading,
      loadingProgress,
      setLoadingProgress,
      formData,
      handleInputChange,
      canNavigateToStep: (stepIndex) => canNavigateToStep(stepIndex, currentStep, completedSteps),
      navigateToStep: handleNavigateToStep,
      canAdvanceToNextStep: () => canAdvanceToNextStep(currentStep, completedSteps),
      handleNext,
      handleBack
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
