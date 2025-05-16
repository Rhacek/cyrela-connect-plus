
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, refreshSession, isRefreshing } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function usePeriodicSessionCheck(isAuthorized: boolean | null) {
  const navigate = useNavigate();
  const sessionChecksRef = useRef<number>(0);
  const lastValidCheckRef = useRef<number>(Date.now());
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    if (isAuthorized) {
      console.log("Setting up periodic session checks for protected route");
      
      // Reset counter when component mounts with authorization
      sessionChecksRef.current = 0;
      lastValidCheckRef.current = Date.now();
      
      // Function to schedule next check with exponential backoff
      const scheduleNextCheck = () => {
        if (checkIntervalRef.current) {
          clearTimeout(checkIntervalRef.current);
        }
        
        // Base interval of 20 minutes
        let interval = 20 * 60 * 1000;
        
        // Add some jitter to prevent all clients from checking at the same time
        interval += Math.random() * 60000; // Add up to 1 minute of random jitter
        
        checkIntervalRef.current = window.setTimeout(performSessionCheck, interval);
        console.log(`Next session check scheduled in ${Math.round(interval/60000)} minutes`);
      };
      
      // Function to perform the actual check
      const performSessionCheck = async () => {
        if (!isMounted) return;
        
        // Skip if a refresh is already in progress
        if (isRefreshing) {
          console.log("Skipping periodic check - refresh in progress");
          scheduleNextCheck();
          return;
        }
        
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
              scheduleNextCheck();
            }
            return;
          }
          
          // Session is valid, update last valid check timestamp
          lastValidCheckRef.current = Date.now();
          console.log("Periodic check: Session valid");
          scheduleNextCheck();
        } catch (err) {
          console.error("Error during periodic session check:", err);
          
          // Only redirect if we haven't had a valid check in the last 20 minutes
          const timeSinceLastValidCheck = Date.now() - lastValidCheckRef.current;
          if (timeSinceLastValidCheck > 20 * 60 * 1000) {
            handleSessionLossWithDelay();
          } else {
            console.log("Ignoring temporary error, last valid check was recent");
            scheduleNextCheck();
          }
        }
      };
      
      // Start the first check cycle
      scheduleNextCheck();
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
        
        // Navigate to auth page with current route as redirect parameter
        const currentPath = window.location.pathname;
        navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
      }, 3000); // 3 second delay before redirect
    }
    
    return () => {
      isMounted = false;
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
      }
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [isAuthorized, navigate]);
}
