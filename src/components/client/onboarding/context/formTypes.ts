
import { OnboardingFormData } from "../types";

export interface FormContextProps {
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
  handleNext: () => OnboardingFormData | undefined;
  handleBack: () => void;
}
