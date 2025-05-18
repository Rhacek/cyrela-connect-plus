
import { supabase } from "@/integrations/supabase/client";
import { PlanType } from "@/types";

export type SubscriptionTier = "FREE" | "PRO" | "ENTERPRISE";

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: SubscriptionTier | null;
  subscription_end: string | null;
}

export interface SubscriberRecord {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id: string | null;
  subscribed: boolean;
  subscription_tier: SubscriptionTier | null;
  subscription_end: string | null;
  updated_at: string;
  created_at: string;
}

export const subscriptionService = {
  async checkSubscription(): Promise<SubscriptionData> {
    const { data, error } = await supabase.functions.invoke<SubscriptionData>("check-subscription");
    
    if (error) {
      console.error("Error checking subscription:", error);
      throw error;
    }
    
    return data;
  },

  async createCheckoutSession(planType: PlanType): Promise<string> {
    const { data, error } = await supabase.functions.invoke<{ url: string }>("create-checkout", {
      body: { planType },
    });
    
    if (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
    
    return data.url;
  },

  async createCustomerPortalSession(): Promise<string> {
    const { data, error } = await supabase.functions.invoke<{ url: string }>("customer-portal");
    
    if (error) {
      console.error("Error creating customer portal session:", error);
      throw error;
    }
    
    return data.url;
  },

  async getSubscriberData(): Promise<SubscriberRecord | null> {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .single();
    
    if (error) {
      if (error.code === "PGRST116") {
        // No data found
        return null;
      }
      console.error("Error fetching subscriber data:", error);
      throw error;
    }
    
    // Ensure the subscription_tier is of the correct type
    if (data) {
      return {
        ...data,
        subscription_tier: data.subscription_tier as SubscriptionTier | null
      };
    }
    
    return null;
  }
};
