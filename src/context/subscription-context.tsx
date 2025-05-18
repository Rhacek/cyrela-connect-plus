
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export interface SubscriptionState {
  isSubscribed: boolean;
  tier: string | null;
  expiresAt: Date | null;
  isLoading: boolean;
  lastChecked: Date | null;
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  createCheckoutSession: (planType: string) => Promise<string | null>;
  createCustomerPortalSession: () => Promise<string | null>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    tier: null,
    expiresAt: null,
    isLoading: false,
    lastChecked: null,
  });

  const checkSubscription = async (): Promise<void> => {
    if (!session) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) {
        console.error("Error checking subscription:", error);
        toast.error("Erro ao verificar assinatura");
        return;
      }

      setState({
        isSubscribed: data.subscribed,
        tier: data.subscription_tier,
        expiresAt: data.subscription_end ? new Date(data.subscription_end) : null,
        isLoading: false,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error("Unexpected error checking subscription:", error);
      toast.error("Erro ao verificar assinatura");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const createCheckoutSession = async (planType: string): Promise<string | null> => {
    if (!session) {
      toast.error("Você precisa estar logado para assinar um plano");
      return null;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planType },
      });

      if (error) {
        console.error("Error creating checkout session:", error);
        toast.error("Erro ao criar sessão de checkout");
        return null;
      }

      return data.url;
    } catch (error) {
      console.error("Unexpected error creating checkout session:", error);
      toast.error("Erro ao criar sessão de checkout");
      return null;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const createCustomerPortalSession = async (): Promise<string | null> => {
    if (!session) {
      toast.error("Você precisa estar logado para gerenciar sua assinatura");
      return null;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) {
        console.error("Error creating customer portal session:", error);
        toast.error("Erro ao criar sessão do portal do cliente");
        return null;
      }

      return data.url;
    } catch (error) {
      console.error("Unexpected error creating customer portal session:", error);
      toast.error("Erro ao criar sessão do portal do cliente");
      return null;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (session) {
      checkSubscription();
    } else {
      setState({
        isSubscribed: false,
        tier: null,
        expiresAt: null,
        isLoading: false,
        lastChecked: null,
      });
    }
  }, [session]);

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        checkSubscription,
        createCheckoutSession,
        createCustomerPortalSession,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
