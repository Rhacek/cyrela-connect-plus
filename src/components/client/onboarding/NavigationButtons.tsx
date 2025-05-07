
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canAdvance: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  canAdvance,
  onNext,
  onBack
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 0 ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      ) : (
        <div className="flex-1 mr-2"></div>
      )}
      
      <Button
        type="button"
        onClick={onNext}
        className={cn(
          "flex-1 ml-2 bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white",
          {
            "pointer-events-none opacity-50": !canAdvance
          }
        )}
      >
        {currentStep === totalSteps - 1 ? "Finalizar" : "Próximo"}
        {currentStep !== totalSteps - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
      </Button>
    </div>
  );
}
