
import { plans } from "@/types/plan";
import { useEffect, useState } from "react";
import { SubscriptionCard } from "@/components/broker/plans/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useSubscription } from "@/context/subscription-context";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function BrokerPlans() {
  const { checkSubscription, isLoading } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);
  const location = useLocation();
  
  // Check for success or canceled query params from Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');
    
    if (success === 'true') {
      toast.success("Assinatura realizada com sucesso!");
      // Refresh subscription status after successful payment
      handleRefreshSubscription();
    }
    
    if (canceled === 'true') {
      toast.error("Processo de assinatura cancelado");
    }
    
    // Clean up URL parameters
    if (success || canceled) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location]);
  
  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      await checkSubscription();
      toast.success("Status de assinatura atualizado");
    } catch (error) {
      console.error("Error refreshing subscription:", error);
      toast.error("Erro ao atualizar status de assinatura");
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Planos de Assinatura</h1>
          <p className="text-gray-500">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshSubscription}
          disabled={refreshing || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar Status
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <SubscriptionCard key={plan.id} plan={plan} />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Sobre os Planos</h3>
        <p className="text-sm text-gray-600">
          Todos os planos são cobrados mensalmente e podem ser cancelados a qualquer momento.
          O plano PRO oferece recursos avançados para corretores que desejam maximizar suas vendas.
          Para mais informações sobre os planos ou suporte personalizado, entre em contato com nosso time de atendimento.
        </p>
      </div>
    </div>
  );
}
