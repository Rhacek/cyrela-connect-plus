
import { Button } from "@/components/ui/button";
import { useFormContext } from "./context/FormContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  onSubmit?: () => void;
}

export function NavigationButtons({ onSubmit }: NavigationButtonsProps) {
  const { 
    currentStep,
    isLoading,
    handleBack, 
    canAdvanceToNextStep,
    handleNext
  } = useFormContext();
  
  const isLastStep = currentStep === 4; // Adjusted for 5 total steps (0-4)
  
  const handleNextClick = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      handleNext();
    }
  };
  
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 0 || isLoading}
        className="px-4 py-2 text-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <Button
        onClick={handleNextClick}
        disabled={!canAdvanceToNextStep() || isLoading}
        className="px-4 py-2 text-sm"
      >
        {isLastStep ? (
          "Finalizar"
        ) : (
          <>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
