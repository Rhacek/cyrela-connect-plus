
import { cn } from "@/lib/utils";
import { Plan } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  currentPlan?: string;
  onSelect: (plan: Plan) => void;
}

export function PlanCard({ plan, currentPlan, onSelect }: PlanCardProps) {
  const isCurrentPlan = currentPlan === plan.id;
  
  return (
    <div 
      className={cn(
        "rounded-lg border p-6 shadow-sm relative flex flex-col h-full",
        plan.isMostPopular ? "border-primary" : "border-border",
        isCurrentPlan ? "bg-muted/50" : "bg-card"
      )}
    >
      {plan.isMostPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
          Mais Popular
        </div>
      )}
      
      <div className="mb-4 mt-2">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        )}
      </div>
      
      <div className="mb-4">
        <span className="text-3xl font-bold">
          {plan.price === 0 ? "Grátis" : `R$${plan.price.toFixed(2)}`}
        </span>
        {plan.price > 0 && (
          <span className="text-muted-foreground text-sm">
            /{plan.billingPeriod === "monthly" ? "mês" : "ano"}
          </span>
        )}
      </div>
      
      <ul className="space-y-2 mb-6 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        onClick={() => onSelect(plan)}
        variant={isCurrentPlan ? "outline" : "default"}
        className="w-full mt-auto"
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Plano Atual" : "Selecionar Plano"}
      </Button>
    </div>
  );
}
