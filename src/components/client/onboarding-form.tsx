
import { AppLogo } from "@/components/ui/app-logo";
import { FormProvider } from "./onboarding/context/FormContext";
import { FormController } from "./onboarding/FormController";

export function OnboardingForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <AppLogo className="mx-auto mb-8" />
      
      <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6">
        <FormProvider>
          <FormController />
        </FormProvider>
      </div>
    </div>
  );
}
