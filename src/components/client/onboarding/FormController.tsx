
import { StepContainer } from "./StepContainer";
import { StepNavigation } from "./StepNavigation";
import { NavigationButtons } from "./NavigationButtons";
import { useFormContext } from "./context/FormContext";
import { ContactStep } from "./steps/ContactStep";
import { LocationStep } from "./steps/LocationStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ObjectiveStep } from "./steps/ObjectiveStep";
import { ReviewStep } from "./steps/ReviewStep";

// Define steps array here instead of importing it
const steps = [ContactStep, LocationStep, DetailsStep, ObjectiveStep, ReviewStep];

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

  const handleSubmitClick = () => {
    const result = handleNext();
    if (result && typeof onSubmit === 'function') {
      onSubmit(formData);
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <StepNavigation 
        steps={steps} 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
        canNavigateToStep={canNavigateToStep}
        navigateToStep={navigateToStep}
      />
      
      <StepContainer isLoading={isLoading} loadingProgress={loadingProgress}>
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
