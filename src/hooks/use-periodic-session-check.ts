
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, refreshSession } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function usePeriodicSessionCheck(isAuthorized: boolean | null) {
  const navigate = useNavigate();
  const sessionChecksRef = useRef<number>(0);
  const lastValidCheckRef = useRef<number>(Date.now());
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (isAuthorized) {
      console.log("Setting up periodic session checks for protected route");
      
      // Reset counter when component mounts with authorization
      sessionChecksRef.current = 0;
      lastValidCheckRef.current = Date.now();
      
      // Verify session every 10 minutes (reduced frequency)
      intervalId = window.setInterval(async () => {
        if (!isMounted) return;
        
        // Increment check counter
        sessionChecksRef.current += 1;
        
        try {
          console.log(`Performing periodic session check #${sessionChecksRef.current}`);
          
          // Get current session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error checking session:", error);
            handleSessionLossWithDelay();
            return;
          }
          
          if (!data.session) {
            console.warn("Session lost during periodic check");
            
            // Try to refresh the session before giving up
            const refreshedSession = await refreshSession();
            
            if (!refreshedSession) {
              handleSessionLossWithDelay();
            } else {
              // Session refreshed successfully
              lastValidCheckRef.current = Date.now();
              console.log("Session refreshed successfully in periodic check");
            }
            return;
          }
          
          // Session is valid, update last valid check timestamp
          lastValidCheckRef.current = Date.now();
          console.log("Periodic check: Session valid");
        } catch (err) {
          console.error("Error during periodic session check:", err);
          
          // Only redirect if we haven't had a valid check in the last 10 minutes
          const timeSinceLastValidCheck = Date.now() - lastValidCheckRef.current;
          if (timeSinceLastValidCheck > 10 * 60 * 1000) {
            handleSessionLossWithDelay();
          } else {
            console.log("Ignoring temporary error, last valid check was recent");
          }
        }
      }, 10 * 60 * 1000); // 10 minutes
    }
    
    function handleSessionLossWithDelay() {
      if (!isMounted) return;
      
      // Clear any existing redirect timer
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      
      // Set a new redirect timer with delay
      redirectTimerRef.current = setTimeout(() => {
        if (!isMounted) return;
        
        console.warn("Protected route: Session lost, redirecting to login");
        toast.error("Sua sessão expirou", { 
          description: "Redirecionando para página de login..." 
        });
        
        // Navigate to auth page
        navigate("/auth", { replace: true });
      }, 3000); // 3 second delay before redirect
    }
    
    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [isAuthorized, navigate]);
}
