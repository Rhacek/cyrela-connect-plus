
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan } from "@/types/plan";
import { useSubscription } from "@/context/subscription-context";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SubscriptionCardProps {
  plan: Plan;
}

export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  const { isSubscribed, tier, expiresAt, createCheckoutSession, createCustomerPortalSession } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  
  const isPlanActive = isSubscribed && tier === plan.type;
  
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const checkoutUrl = await createCheckoutSession(plan.type);
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const portalUrl = await createCustomerPortalSession();
      if (portalUrl) {
        window.open(portalUrl, '_blank');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn(
      "flex flex-col", 
      isPlanActive ? "border-2 border-green-500" : "",
      plan.isMostPopular ? "shadow-lg" : ""
    )}>
      {plan.isMostPopular && (
        <div className="py-1 px-4 bg-cyan-600 text-white text-center text-sm font-medium rounded-t-md">
          Mais Popular
        </div>
      )}
      
      {isPlanActive && (
        <div className="py-1 px-4 bg-green-500 text-white text-center text-sm font-medium rounded-t-md">
          Seu Plano Atual
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="mb-6">
          <p className="text-3xl font-bold">
            R$ {plan.price.toFixed(2).replace(".", ",")}
            <span className="text-sm font-normal text-gray-500">/mês</span>
          </p>
        </div>
        
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {isPlanActive && expiresAt && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
            Renovação em: {format(expiresAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4">
        {isPlanActive ? (
          <Button 
            onClick={handleManageSubscription} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Gerenciar Assinatura"}
          </Button>
        ) : (
          <Button 
            onClick={handleSubscribe} 
            className={cn(
              "w-full",
              plan.isMostPopular ? "bg-cyan-600 hover:bg-cyan-700" : ""
            )}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Assinar Plano"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
