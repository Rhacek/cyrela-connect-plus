
import { useNavigate } from "react-router-dom";
import { OnboardingForm } from "@/components/client/onboarding-form";
import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyrela-gray-lightest flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo />
          <Button
            variant="ghost"
            className="text-cyrela-gray-dark hover:text-cyrela-red"
            onClick={() => navigate("/client/broker")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <OnboardingForm />
      </div>
    </div>
  );
};

export default OnboardingPage;
