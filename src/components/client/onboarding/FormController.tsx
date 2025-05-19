
import { StepContainer } from "./StepContainer";
import { StepNavigation } from "./StepNavigation";
import { NavigationButtons } from "./NavigationButtons";
import { useFormContext } from "./context/FormContext";
import { ONBOARDING_STEPS } from "./steps";

interface FormControllerProps {
  onSubmit: (formData: any) => void;
}

export function FormController({ onSubmit }: FormControllerProps) {
  const { 
    currentStep, 
    completedSteps, 
    isLoading,
    formData,
    handleNext,
    canNavigateToStep,
    navigateToStep,
    loadingProgress
  } = useFormContext();

  // Get step components from the ONBOARDING_STEPS array
  const stepComponents = ONBOARDING_STEPS.map(step => step.component);

  const handleSubmitClick = () => {
    handleNext();
    
    // Only call onSubmit if we're on the last step
    if (currentStep === stepComponents.length - 1) {
      if (typeof onSubmit === 'function') {
        onSubmit(formData);
        return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <StepNavigation 
        steps={ONBOARDING_STEPS} 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
        canNavigateToStep={canNavigateToStep}
        navigateToStep={navigateToStep}
      />
      
      <StepContainer isLoading={isLoading} loadingProgress={loadingProgress}>
        {stepComponents.map((StepComponent, index) => (
          <div key={index} className={index === currentStep ? "block" : "hidden"}>
            <StepComponent {...formData} />
          </div>
        ))}
      </StepContainer>
      
      <NavigationButtons onSubmit={handleSubmitClick} />
    </div>
  );
}
