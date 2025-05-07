
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ONBOARDING_STEPS } from "./steps";
import { StepNavigation } from "./StepNavigation";
import { NavigationButtons } from "./NavigationButtons";
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
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="my-4 animate-fade-in">
          <Progress value={loadingProgress} className="h-1" />
        </div>
      )}
      
      {/* Step content with animation */}
      <div className={cn("transition-all duration-300", 
        isLoading ? "opacity-50 pointer-events-none" : "animate-fade-in")}>
        {currentStep === 0 && (
          <ObjectiveStep 
            value={formData.objective}
            onChange={(value) => handleInputChange("objective", value)}
          />
        )}
        
        {currentStep === 1 && (
          <StageStep 
            value={formData.stage}
            onChange={(value) => handleInputChange("stage", value)}
          />
        )}
        
        {currentStep === 2 && (
          <LocationStep 
            city={formData.city}
            zone={formData.zone}
            neighborhoods={formData.neighborhoods}
            onCityChange={(value) => handleInputChange("city", value)}
            onZoneChange={(value) => handleInputChange("zone", value)}
            onNeighborhoodsChange={(value) => handleInputChange("neighborhoods", value)}
          />
        )}
        
        {currentStep === 3 && (
          <DetailsStep 
            bedrooms={formData.bedrooms}
            budget={formData.budget}
            onBedroomsChange={(value) => handleInputChange("bedrooms", value)}
            onBudgetChange={(value) => handleInputChange("budget", value)}
          />
        )}
        
        {currentStep === 4 && (
          <ContactStep 
            name={formData.name}
            email={formData.email}
            phone={formData.phone}
            onNameChange={(value) => handleInputChange("name", value)}
            onEmailChange={(value) => handleInputChange("email", value)}
            onPhoneChange={(value) => handleInputChange("phone", value)}
          />
        )}
        
        {currentStep === 5 && (
          <ReviewStep formData={formData} />
        )}
      </div>
      
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
