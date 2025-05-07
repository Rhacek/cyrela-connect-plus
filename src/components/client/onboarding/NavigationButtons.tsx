
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canAdvance: boolean;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  canAdvance,
  onNext,
  onBack,
  isLoading = false
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 0 ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 mr-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowLeft className="h-4 w-4 mr-2" />
          )}
          Voltar
        </Button>
      ) : (
        <div className="flex-1 mr-2"></div>
      )}
      
      <Button
        type="button"
        variant="outline"
        onClick={onNext}
        className={cn(
          "flex-1 ml-2",
          {
            "pointer-events-none opacity-50": !canAdvance || isLoading
          }
        )}
        disabled={!canAdvance || isLoading}
      >
        {currentStep === totalSteps - 1 ? (
          <>
            {isLoading && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
            Finalizar
          </>
        ) : (
          <>
            Próximo
            {isLoading ? (
              <LoaderCircle className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </>
        )}
      </Button>
    </div>
  );
}
