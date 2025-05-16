
import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionRestore } from './use-session-restore';
import { useAuthListener } from './use-auth-listener';
import { useCurrentSession } from './use-current-session';
import { supabase, verifySession, signOutAndCleanup } from '@/lib/supabase';

export const useSessionInit = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Use the smaller, more focused hooks
  const { restoredSession, isRestoring } = useSessionRestore();
  const { sessionFromEvent, isListening } = useAuthListener();
  const { currentSession, isChecking } = useCurrentSession();

  // For debugging
  useEffect(() => {
    console.log("useSessionInit status:", {
      isRestoring,
      isListening,
      isChecking,
      hasRestoredSession: !!restoredSession,
      hasEventSession: !!sessionFromEvent,
      hasCurrentSession: !!currentSession,
      sessionId: session?.id
    });
  }, [
    isRestoring,
    isListening,
    isChecking,
    restoredSession,
    sessionFromEvent,
    currentSession,
    session
  ]);

  // Improved session validation helper
  const validateSession = useCallback(async (sessionToValidate: UserSession | null) => {
    if (!sessionToValidate) return false;
    
    try {
      // Check if the user data actually contains what we expect
      if (!sessionToValidate.id || !sessionToValidate.email) {
        console.warn("Session validation failed: missing critical fields", sessionToValidate);
        return false;
      }
      
      // Get fresh session to verify it's still valid
      const { data } = await supabase.auth.getSession();
      const isValid = !!data.session;
      
      if (!isValid) {
        console.warn("Session validation failed: session not found in Supabase");
      }
      
      return isValid;
    } catch (err) {
      console.error("Error validating session:", err);
      return false;
    }
  }, []);

  // Combine the results from all hooks with improved validation
  useEffect(() => {
    let isMounted = true;
    
    const processSessions = async () => {
      // If we have a session from any source, prioritize auth events > current check > restore
      const sessionToUse = sessionFromEvent || currentSession || restoredSession;
      
      if (sessionToUse !== null) {
        console.log("Potential session found from source, validating...", sessionToUse.id);
        
        // Extra validation step
        const isValid = await validateSession(sessionToUse);
        
        if (isValid && isMounted) {
          console.log("Session validated, setting in state:", sessionToUse.id);
          setSession(sessionToUse);
        } else if (!isValid && isMounted) {
          console.warn("Session failed validation, clearing...");
          setSession(null);
          // Clean up any invalid sessions that might remain
          await signOutAndCleanup();
        }
      } else if (!isRestoring && !isChecking && isListening && isMounted) {
        // If all checks are complete and we don't have a session, clear it
        console.log("All session checks complete, no valid session found");
        setSession(null);
      }
      
      // Mark as not loading when all checks are complete
      if (!isRestoring && isListening && !isChecking && isMounted) {
        console.log("All session checks complete, setting loading=false");
        setLoading(false);
        setInitialized(true);
      }
    };
    
    processSessions();
    
    return () => {
      isMounted = false;
    };
  }, [
    restoredSession, isRestoring,
    sessionFromEvent, isListening,
    currentSession, isChecking,
    validateSession
  ]);

  // Periodic session verification to ensure it's still valid
  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (initialized && session) {
      // Verify session every 5 minutes
      intervalId = window.setInterval(async () => {
        if (!isMounted) return;
        
        console.log("Performing periodic session verification check");
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.warn("Periodic check: Session invalid, attempting to refresh");
            
            // Try to refresh the session
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError || !refreshData.session) {
              console.warn("Session refresh failed, clearing session");
              
              if (isMounted) {
                setSession(null);
                // Ensure we actually clean up
                await signOutAndCleanup();
              }
            } else if (isMounted) {
              console.log("Session refreshed successfully in periodic check");
              // We don't need to update the session here as the auth listener will handle this
            }
          } else {
            console.log("Periodic check: Session still valid");
          }
        } catch (err) {
          console.error("Error during periodic session check:", err);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
    
    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [initialized, session]);

  return {
    session,
    setSession,
    loading,
    setLoading,
    initialized,
  };
};
