
import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionRestore } from './use-session-restore';
import { useAuthListener } from './use-auth-listener';
import { useCurrentSession } from './use-current-session';
import { supabase, refreshSession, sessionEvent, SESSION_UPDATED, SESSION_REMOVED } from '@/lib/supabase';

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
    if (process.env.NODE_ENV === 'development') {
      console.log("useSessionInit status:", {
        isRestoring,
        isListening,
        isChecking,
        hasRestoredSession: !!restoredSession,
        hasEventSession: !!sessionFromEvent,
        hasCurrentSession: !!currentSession,
        sessionId: session?.id
      });
    }
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
        // Extra validation step
        const isValid = await validateSession(sessionToUse);
        
        if (isValid && isMounted) {
          setSession(sessionToUse);
        } else if (!isValid && isMounted) {
          console.warn("Session failed validation, clearing...");
          setSession(null);
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
    
    // Listen for session events
    const handleSessionUpdate = (event: any) => {
      if (isMounted && event.detail?.session) {
        console.log("Session context received session update event");
        const { transformUserData } = require('@/utils/auth-utils');
        const userSession = transformUserData(event.detail.session.user);
        setSession(userSession);
      }
    };
    
    const handleSessionRemoval = () => {
      if (isMounted) {
        console.log("Session context received session removal event");
        setSession(null);
      }
    };
    
    sessionEvent.addEventListener(SESSION_UPDATED, handleSessionUpdate);
    sessionEvent.addEventListener(SESSION_REMOVED, handleSessionRemoval);
    
    return () => {
      isMounted = false;
      sessionEvent.removeEventListener(SESSION_UPDATED, handleSessionUpdate);
      sessionEvent.removeEventListener(SESSION_REMOVED, handleSessionRemoval);
    };
  }, [
    restoredSession, isRestoring,
    sessionFromEvent, isListening,
    currentSession, isChecking,
    validateSession
  ]);

  // Periodic session verification with reduced frequency
  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (initialized && session) {
      // Verify session every 15 minutes instead of 5
      intervalId = window.setInterval(async () => {
        if (!isMounted) return;
        
        console.log("Performing periodic session verification check");
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.warn("Periodic check: Session invalid, attempting to refresh");
            
            // Use the centralized refresh function
            const refreshedSession = await refreshSession();
            
            if (!refreshedSession && isMounted) {
              // Only clear the session after a delay to avoid race conditions
              setTimeout(() => {
                if (isMounted) setSession(null);
              }, 2000);
            }
          } else {
            console.log("Periodic check: Session still valid");
          }
        } catch (err) {
          console.error("Error during periodic session check:", err);
        }
      }, 15 * 60 * 1000); // 15 minutes instead of 5
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
