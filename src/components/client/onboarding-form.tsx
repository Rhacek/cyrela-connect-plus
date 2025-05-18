
import { useNavigate } from "react-router-dom";
import { FormProvider } from "./onboarding/context/FormContext";
import { FormController } from "./onboarding/FormController";
import { useBrokerReferral } from "@/hooks/use-broker-referral";
import { leadsService } from "@/services/leads.service";
import { LeadStatus } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export function OnboardingForm() {
  const navigate = useNavigate();
  const { brokerId } = useBrokerReferral();
  const { toast } = useToast();

  const handleSubmitForm = async (formData: any) => {
    try {
      // Create lead data structure
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: LeadStatus.NEW,
        source: brokerId ? 'broker_referral' : 'website',
        isManual: false,
        createdById: brokerId || "system", // Using broker ID as creator if available
        assignedToId: brokerId, // Assigning to the broker who referred
        desiredLocation: Array.isArray(formData.neighborhoods) && formData.neighborhoods.length > 0 ? 
          formData.neighborhoods.join(', ') : formData.zone || formData.city,
        preferredBedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      };

      // Save lead to database
      const result = await leadsService.createLead(leadData);
      
      if (result) {
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Vamos encontrar o imóvel perfeito para você.",
          variant: "default",
        });
        
        // Navigate to results with search parameters
        navigate("/client/results", { 
          state: { 
            searchParams: {
              zone: formData.zone,
              neighborhoods: formData.neighborhoods,
              bedrooms: formData.bedrooms,
              budget: formData.budget
            },
            fromForm: true
          } 
        });
      } else {
        throw new Error("Erro ao criar lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-cyrela-gray-dark mb-2">
          Encontre seu imóvel ideal
        </h2>
        <p className="text-cyrela-gray mb-6">
          Preencha o formulário abaixo para encontrarmos as melhores opções para você
        </p>
        
        <FormProvider>
          <FormController onSubmit={handleSubmitForm} />
        </FormProvider>
      </div>
    </div>
  );
}
