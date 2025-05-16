
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, verifySession } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function usePeriodicSessionCheck(isAuthorized: boolean | null) {
  const navigate = useNavigate();
  const sessionChecksRef = useRef<number>(0);
  const lastValidCheckRef = useRef<number>(Date.now());

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (isAuthorized) {
      console.log("Setting up periodic session checks for protected route");
      
      // Reset counter when component mounts with authorization
      sessionChecksRef.current = 0;
      lastValidCheckRef.current = Date.now();
      
      // Verify session every 3 minutes (reduced from 5 for more frequent checks)
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
            handleSessionLoss();
            return;
          }
          
          if (!data.session) {
            console.warn("Session lost during periodic check");
            handleSessionLoss();
            return;
          }
          
          // Additional verification to ensure token is valid
          const isValid = await verifySession(data.session);
          
          if (!isValid) {
            console.warn("Session token verification failed");
            handleSessionLoss();
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
            handleSessionLoss();
          } else {
            console.log("Ignoring temporary error, last valid check was recent");
          }
        }
      }, 3 * 60 * 1000); // 3 minutes
    }
    
    function handleSessionLoss() {
      if (!isMounted) return;
      
      console.warn("Protected route: Session lost, redirecting to login");
      toast.error("Sua sessão expirou", { 
        description: "Redirecionando para página de login..." 
      });
      
      // Navigate to auth page
      navigate("/auth", { replace: true });
    }
    
    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthorized, navigate]);
}
