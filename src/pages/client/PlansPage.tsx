
import { useState } from "react";
import { plans } from "@/types/plan";
import { PlanCard } from "@/components/client/plans/PlanCard";
import { toast } from "sonner";

const PlansPage = () => {
  const [currentPlanId, setCurrentPlanId] = useState("free-plan"); // Default to free plan
  
  const handleSelectPlan = (planId: string) => {
    // In a real app, this would call an API to update the user's plan
    setCurrentPlanId(planId);
    toast.success("Plano selecionado com sucesso!");
  };
  
  return (
    <div className="container max-w-5xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nossos Planos</h1>
        <p className="text-muted-foreground">
          Escolha o plano que melhor se adapta às suas necessidades
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlanId}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
