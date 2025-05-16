
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { logAuthState } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useDashboardSession = () => {
  const { session } = useAuth();
  const [hasInitializedQueries, setHasInitializedQueries] = useState(false);
  
  // Check if session is available, but only run once
  useEffect(() => {
    const initializeQueries = async () => {
      if (session?.id && !hasInitializedQueries) {
        console.log("Verifying auth state from Supabase directly...");
        const currentSession = await logAuthState();
        
        if (currentSession) {
          console.log("Session verified, initializing queries");
          setHasInitializedQueries(true);
        } else {
          console.log("Session not verified, redirecting to auth");
          toast.error("Sessão expirada. Faça login novamente.");
        }
      }
    };
    
    initializeQueries();
  }, [session, hasInitializedQueries]);
  
  return {
    session,
    hasInitializedQueries
  };
};
