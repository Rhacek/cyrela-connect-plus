
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "./steps";
import { StepNavigation } from "./StepNavigation";
import { NavigationButtons } from "./NavigationButtons";
import { StepContainer } from "./StepContainer";
import { ObjectiveStep } from "./steps/ObjectiveStep";
import { StageStep } from "./steps/StageStep";
import { LocationStep } from "./steps/LocationStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ContactStep } from "./steps/ContactStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useFormContext } from "./context/FormContext";

export function FormController() {
  const {
    currentStep,
    completedSteps,
    isLoading,
    loadingProgress,
    formData,
    handleInputChange,
    canNavigateToStep,
    navigateToStep,
    canAdvanceToNextStep,
    handleNext,
    handleBack
  } = useFormContext();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ObjectiveStep 
            value={formData.objective}
            onChange={(value) => handleInputChange("objective", value)}
          />
        );
      case 1:
        return (
          <StageStep 
            value={formData.stage}
            onChange={(value) => handleInputChange("stage", value)}
          />
        );
      case 2:
        return (
          <LocationStep 
            city={formData.city}
            zone={formData.zone}
            neighborhoods={formData.neighborhoods}
            onCityChange={(value) => handleInputChange("city", value)}
            onZoneChange={(value) => handleInputChange("zone", value)}
            onNeighborhoodsChange={(value) => handleInputChange("neighborhoods", value)}
          />
        );
      case 3:
        return (
          <DetailsStep 
            bedrooms={formData.bedrooms}
            budget={formData.budget}
            onBedroomsChange={(value) => handleInputChange("bedrooms", value)}
            onBudgetChange={(value) => handleInputChange("budget", value)}
          />
        );
      case 4:
        return (
          <ContactStep 
            name={formData.name}
            email={formData.email}
            phone={formData.phone}
            onNameChange={(value) => handleInputChange("name", value)}
            onEmailChange={(value) => handleInputChange("email", value)}
            onPhoneChange={(value) => handleInputChange("phone", value)}
          />
        );
      case 5:
        return (
          <ReviewStep formData={formData} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-cyrela-blue">
          {ONBOARDING_STEPS[currentStep].title}
        </h2>
        <p className="text-cyrela-gray-dark mt-1">
          {ONBOARDING_STEPS[currentStep].description}
        </p>
      </div>
      
      <StepNavigation 
        steps={ONBOARDING_STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        canNavigateToStep={canNavigateToStep}
        navigateToStep={navigateToStep}
        isLoading={isLoading}
      />
      
      <StepContainer isLoading={isLoading} loadingProgress={loadingProgress}>
        {renderCurrentStep()}
      </StepContainer>
      
      <NavigationButtons 
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        canAdvance={canAdvanceToNextStep()}
        onNext={handleNext}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </>
  );
}
