
import { useState } from "react";
import { plans } from "@/types/plan";
import { PlanCard } from "@/components/client/plans/PlanCard";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const BrokerPlans = () => {
  const [currentPlanId, setCurrentPlanId] = useState("free-plan"); // Default to free plan
  
  const handleSelectPlan = (planId: string) => {
    // In a real app, this would call an API to update the user's plan
    setCurrentPlanId(planId);
    toast.success("Plano selecionado com sucesso!");
  };
  
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Meu Plano</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Atualize seu Plano</CardTitle>
              <CardDescription>
                Melhore seu acesso com nossos planos premium
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    currentPlan={currentPlanId}
                    onSelect={() => handleSelectPlan(plan.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Benefícios do Plano Pro</CardTitle>
              <CardDescription>
                Por que atualizar para o Plano Pro?
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Mais Leads</h3>
                <p className="text-sm text-muted-foreground">
                  Receba leads qualificados diretamente em seu painel
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Ferramentas Avançadas</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse relatórios e ferramentas de marketing exclusivas
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Suporte Prioritário</h3>
                <p className="text-sm text-muted-foreground">
                  Obtenha ajuda rápida sempre que precisar
                </p>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={() => handleSelectPlan("pro-plan")}>
                  Atualizar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrokerPlans;
