
import { useState, useEffect } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "./onboarding/steps";
import { OnboardingFormData } from "./onboarding/types";
import { StepNavigation } from "./onboarding/StepNavigation";
import { NavigationButtons } from "./onboarding/NavigationButtons";
import { ObjectiveStep } from "./onboarding/steps/ObjectiveStep";
import { StageStep } from "./onboarding/steps/StageStep";
import { LocationStep } from "./onboarding/steps/LocationStep";
import { DetailsStep } from "./onboarding/steps/DetailsStep";
import { ContactStep } from "./onboarding/steps/ContactStep";
import { ReviewStep } from "./onboarding/steps/ReviewStep";
import { Progress } from "@/components/ui/progress";

export function OnboardingForm() {
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
    if (currentStep < ONBOARDING_STEPS.length - 1) {
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
    <div className="w-full max-w-md mx-auto">
      <AppLogo className="mx-auto mb-8" />
      
      <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6">
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
      </div>
    </div>
  );
}
