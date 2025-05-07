
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { OnboardingFormData } from "../types";

interface FormContextProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: number[];
  setCompletedSteps: (steps: number[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  formData: OnboardingFormData;
  handleInputChange: (field: string, value: any) => void;
  canNavigateToStep: (stepIndex: number) => boolean;
  navigateToStep: (stepIndex: number) => void;
  canAdvanceToNextStep: () => boolean;
  handleNext: () => void;
  handleBack: () => void;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
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
    const isCurrentStepCompleted = () => {
      switch (currentStep) {
        case 0:
          return !!formData.objective;
        case 1:
          return !!formData.stage;
        case 2:
          return !!formData.city && !!formData.zone && 
                 (formData.zone !== "zonasul" || formData.neighborhoods.length > 0);
        case 3:
          return !!formData.bedrooms && !!formData.budget;
        case 4:
          return !!formData.name && !!formData.email && !!formData.phone;
        default:
          return false;
      }
    };

    if (isCurrentStepCompleted() && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  }, [formData, currentStep, completedSteps]);

  // Loading progress effect
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 25;
        });
      }, 75);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [isLoading]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto advance for radio buttons and selects
    if (field === "objective" || field === "stage") {
      // Show loading indicator before advancing
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsLoading(false);
      }, 400);
    }
    
    // For other selects, auto advance if all required fields are filled
    if (field === "city" || field === "zone") {
      if (field === "zone" && value !== "zonasul") {
        // If zone is selected and it's not "zonasul", auto advance
        setIsLoading(true);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsLoading(false);
        }, 400);
      }
    }
    
    if (field === "neighborhoods") {
      // Auto advance if at least one neighborhood is selected
      if (value.length > 0) {
        setIsLoading(true);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsLoading(false);
        }, 400);
      }
    }

    // For bedrooms and budget, auto advance if both are filled
    if ((field === "bedrooms" && formData.budget) || 
        (field === "budget" && formData.bedrooms)) {
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

  const canNavigateToStep = (stepIndex: number) => {
    // Always allow navigating back
    if (stepIndex < currentStep) return true;
    
    // For forward navigation, ensure dependent steps are completed
    if (stepIndex === 5) {
      // Review step requires all previous steps to be completed
      return completedSteps.length >= 5;
    }
    
    // For other steps, check if previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(i)) return false;
    }
    
    return true;
  };

  const navigateToStep = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsLoading(false);
      }, 400);
    }
  };

  const canAdvanceToNextStep = () => {
    if (currentStep === 5) {
      // For the review step, all previous steps must be completed
      return completedSteps.length >= 5;
    }
    
    // For other steps, check if the current step is completed
    return completedSteps.includes(currentStep);
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
      canNavigateToStep,
      navigateToStep,
      canAdvanceToNextStep,
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
