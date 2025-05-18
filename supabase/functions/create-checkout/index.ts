
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  logStep("Function started");
  
  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
  
  try {
    // Get the authorization header and extract the token
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    logStep("Auth token extracted");
    
    // Get user data from the token
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });
    
    // Initialize Stripe with the API key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    
    // Check if a customer already exists for this email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found, will create one in the checkout");
    }
    
    // Get the price data from the request body
    const { priceId, planType } = await req.json();
    
    if (!priceId && !planType) {
      throw new Error("No price ID or plan type provided");
    }
    
    // Determine the price ID for the given plan if not explicitly provided
    let priceLookupId = priceId;
    if (!priceLookupId && planType) {
      logStep("Looking up price for plan type", { planType });
      
      // If using the PRO plan, we hardcode the price ID here
      // In a production environment, you might fetch this from Stripe or your database
      if (planType === "PRO") {
        priceLookupId = "price_1PbcG7CZ6qsJgndJgY3N2QRY"; // Replace with your actual price ID
        logStep("Using hardcoded price ID for PRO plan", { priceLookupId });
      } else {
        throw new Error(`Unknown plan type: ${planType}`);
      }
    }
    
    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceLookupId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/broker/plans?success=true`,
      cancel_url: `${req.headers.get("origin")}/broker/plans?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        userId: user.id,
      },
    });
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url });
    
    // Return the checkout session URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
