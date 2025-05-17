
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, refreshSession } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useSessionCache } from "./use-session-cache";
import { debounce } from "@/lib/utils";

export function usePeriodicSessionCheck(isAuthorized: boolean | null, currentPath: string = "") {
  const navigate = useNavigate();
  const sessionChecksRef = useRef<number>(0);
  const lastValidCheckRef = useRef<number>(Date.now());
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdminRoute = currentPath.startsWith("/admin");
  const { hasValidCache, updateSessionCache } = useSessionCache(currentPath);

  // Create a debounced redirect function to avoid multiple redirects
  const debouncedRedirect = useCallback(
    debounce((path: string) => {
      console.log(`Debounced redirect to ${path}`);
      navigate(path, { replace: true });
    }, 800),
    [navigate]
  );

  // Enhanced function to handle session loss with proper state cleanup
  const handleSessionLoss = useCallback(() => {
    console.warn("Session lost, will redirect to login");
    
    // Display toast message
    toast.error("Sua sessão expirou", { 
      description: "Redirecionando para página de login..." 
    });
    
    // Use the debounced redirect to prevent multiple redirects
    let redirectPath = "/auth";
    if (currentPath) {
      redirectPath += `?redirect=${encodeURIComponent(currentPath)}`;
    }
    debouncedRedirect(redirectPath);
  }, [currentPath, debouncedRedirect]);

  useEffect(() => {
    let isMounted = true;
    
    // Skip setup if we're not authorized or we have a valid cache
    if (!isAuthorized || hasValidCache) {
      console.log(
        hasValidCache 
          ? "Using cached session validation, skipping periodic checks" 
          : "Not authorized, skipping periodic session checks"
      );
      return;
    }
    
    console.log(`Setting up periodic session checks for route: ${currentPath}`);
    
    // Reset counter when component mounts with authorization
    sessionChecksRef.current = 0;
    lastValidCheckRef.current = Date.now();
    
    // Function to schedule next check with increased interval for admin routes
    const scheduleNextCheck = () => {
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
      }
      
      // Base interval longer for admin routes (30 minutes vs 20 minutes)
      let interval = isAdminRoute ? 30 * 60 * 1000 : 20 * 60 * 1000;
      
      // Add some jitter to prevent all clients from checking at the same time
      interval += Math.random() * 60000; // Add up to 1 minute of random jitter
      
      checkIntervalRef.current = setTimeout(performSessionCheck, interval);
      console.log(`Next session check scheduled in ${Math.round(interval/60000)} minutes`);
    };
    
    // Enhanced session check function
    const performSessionCheck = async () => {
      if (!isMounted) return;
      
      // Skip if we're in an admin route and have verified in the last 10 minutes
      const timeSinceLastCheck = Date.now() - lastValidCheckRef.current;
      if (isAdminRoute && timeSinceLastCheck < 10 * 60 * 1000) {
        console.log("Recent admin route check was successful, skipping");
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
          handleSessionLoss();
          return;
        }
        
        if (!data.session) {
          console.warn("Session lost during periodic check");
          
          // Try to refresh the session before giving up
          const refreshedSession = await refreshSession();
          
          if (!refreshedSession) {
            handleSessionLoss();
          } else {
            // Session refreshed successfully
            lastValidCheckRef.current = Date.now();
            
            // Update session cache for this route
            if (isAdminRoute) {
              updateSessionCache(refreshedSession, currentPath);
            }
            
            console.log("Session refreshed successfully in periodic check");
            scheduleNextCheck();
          }
          return;
        }
        
        // Session is valid, update last valid check timestamp
        lastValidCheckRef.current = Date.now();
        
        // For admin routes, update the cache
        if (isAdminRoute) {
          updateSessionCache(data.session, currentPath);
        }
        
        console.log("Periodic check: Session valid");
        scheduleNextCheck();
      } catch (err) {
        console.error("Error during periodic session check:", err);
        
        // Only redirect if we haven't had a valid check in the last 20 minutes
        const timeSinceLastValidCheck = Date.now() - lastValidCheckRef.current;
        if (timeSinceLastValidCheck > 20 * 60 * 1000) {
          handleSessionLoss();
        } else {
          console.log("Ignoring temporary error, last valid check was recent");
          scheduleNextCheck();
        }
      }
    };
    
    // Start the first check cycle, but with a delay for initial page load
    const initialDelay = isAdminRoute ? 30000 : 10000; // Longer delay for admin routes
    checkIntervalRef.current = setTimeout(() => {
      if (isMounted) {
        console.log("Starting first periodic session check after initial delay");
        performSessionCheck();
      }
    }, initialDelay);
    
    return () => {
      isMounted = false;
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
      }
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [isAuthorized, navigate, currentPath, isAdminRoute, hasValidCache, handleSessionLoss, updateSessionCache]);
}
