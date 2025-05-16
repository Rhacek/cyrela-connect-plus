
import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionRestore } from './use-session-restore';
import { useAuthListener } from './use-auth-listener';
import { useCurrentSession } from './use-current-session';
import { 
  refreshSession, 
  sessionEvent, 
  SESSION_UPDATED, 
  SESSION_REMOVED,
  supabase,
  isRefreshing 
} from '@/lib/supabase';
import { transformUserData } from '@/utils/auth-utils';

export const useSessionInit = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState(0);

  // Use the smaller, more focused hooks
  const { restoredSession, isRestoring } = useSessionRestore();
  const { sessionFromEvent, isListening } = useAuthListener();
  const { currentSession, isChecking } = useCurrentSession();

  // Logging helper function for development environment
  const logSessionStatus = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("useSessionInit status:", {
        isRestoring,
        isListening,
        isChecking,
        hasRestoredSession: !!restoredSession,
        hasEventSession: !!sessionFromEvent,
        hasCurrentSession: !!currentSession,
        sessionId: session?.id,
        isRefreshing
      });
    }
  }, [
    isRestoring,
    isListening,
    isChecking,
    restoredSession,
    sessionFromEvent,
    currentSession,
    session,
    isRefreshing
  ]);

  // Debug logging effect
  useEffect(() => {
    logSessionStatus();
  }, [
    isRestoring,
    isListening,
    isChecking,
    restoredSession,
    sessionFromEvent,
    currentSession,
    session,
    isRefreshing,
    logSessionStatus
  ]);

  // Session validation with rate limiting protection
  const validateSession = useCallback(async (sessionToValidate: UserSession | null) => {
    if (!sessionToValidate) return false;
    
    try {
      // Check for required session fields
      if (!hasRequiredSessionFields(sessionToValidate)) {
        console.warn("Session validation failed: missing critical fields", sessionToValidate);
        return false;
      }
      
      // Apply rate limiting
      if (isRateLimited(lastRefreshAttempt)) {
        console.log("Skipping validation check due to recent attempt");
        return true; // Assume valid to prevent excessive checks
      }
      
      setLastRefreshAttempt(Date.now());
      
      // Verify session with Supabase
      return await verifySessionWithSupabase();
    } catch (err) {
      console.error("Error validating session:", err);
      return false;
    }
  }, [lastRefreshAttempt]);

  // Helper for checking required session fields
  const hasRequiredSessionFields = (sessionToValidate: UserSession) => {
    return !!sessionToValidate.id && !!sessionToValidate.email;
  };

  // Helper for rate limiting
  const isRateLimited = (lastAttemptTime: number) => {
    const now = Date.now();
    return (now - lastAttemptTime < 60000); // At least 1 minute between validations
  };

  // Helper for verifying session with Supabase
  const verifySessionWithSupabase = async () => {
    const { data } = await supabase.auth.getSession();
    const isValid = !!data.session;
    
    if (!isValid) {
      console.warn("Session validation failed: session not found in Supabase");
    }
    
    return isValid;
  };

  // Handle session updates from event listeners
  const handleSessionUpdate = useCallback((event: any) => {
    if (event.detail?.session) {
      console.log("Session context received session update event");
      const userSession = transformUserData(event.detail.session.user);
      setSession(userSession);
    }
  }, []);

  // Handle session removal events
  const handleSessionRemoval = useCallback(() => {
    console.log("Session context received session removal event");
    setSession(null);
  }, []);

  // Process session data from different sources
  const processSessions = useCallback(async () => {
    // Prioritize session sources: auth events > current check > restore
    const sessionToUse = sessionFromEvent || currentSession || restoredSession;
    
    if (sessionToUse !== null) {
      await handleExistingSession(sessionToUse);
    } else if (allSessionChecksComplete()) {
      // If all checks are complete and we don't have a session, clear it
      console.log("All session checks complete, no valid session found");
      setSession(null);
    }
    
    // Mark as not loading when all checks are complete
    if (allSessionChecksComplete()) {
      console.log("All session checks complete, setting loading=false");
      setLoading(false);
      setInitialized(true);
    }
  }, [
    restoredSession, 
    sessionFromEvent, 
    currentSession, 
    isRestoring, 
    isListening, 
    isChecking,
    validateSession
  ]);

  // Helper to check if all session checks are complete
  const allSessionChecksComplete = () => {
    return !isRestoring && isListening && !isChecking;
  };

  // Handle existing session with validation
  const handleExistingSession = async (sessionToUse: UserSession) => {
    const isValid = await validateSession(sessionToUse);
    
    if (isValid) {
      setSession(sessionToUse);
    } else if (!isRefreshing) {
      // Only try to refresh if we're not already refreshing
      console.warn("Session failed validation, attempting refresh...");
      const refreshedSession = await refreshSession();
      
      if (!refreshedSession) {
        setSession(null);
      }
    }
  };

  // Run periodic session verification
  const runPeriodicVerification = useCallback(async () => {
    // Skip checks if a refresh is already in progress
    if (isRefreshing) {
      console.log("Skipping periodic check - refresh already in progress");
      return;
    }
    
    console.log("Performing periodic session verification check");
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        await handleInvalidSession();
      } else {
        console.log("Periodic check: Session still valid");
      }
    } catch (err) {
      console.error("Error during periodic session check:", err);
    }
  }, []);

  // Handle invalid session during verification
  const handleInvalidSession = async () => {
    console.warn("Periodic check: Session invalid, attempting to refresh");
    
    // Use the centralized refresh function
    const refreshedSession = await refreshSession();
    
    if (!refreshedSession) {
      // Only clear the session after a delay to avoid race conditions
      setTimeout(() => {
        setSession(null);
      }, 2000);
    }
  };

  // Main effect for session processing
  useEffect(() => {
    let isMounted = true;
    
    const processSessionsWrapper = async () => {
      if (isMounted) {
        await processSessions();
      }
    };
    
    processSessionsWrapper();
    
    // Listen for session events
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
    validateSession,
    processSessions,
    handleSessionUpdate,
    handleSessionRemoval
  ]);

  // Periodic session verification effect
  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (initialized && session) {
      // Verify session every 20 minutes
      intervalId = window.setInterval(() => {
        if (isMounted) {
          runPeriodicVerification();
        }
      }, 20 * 60 * 1000); // 20 minutes
    }
    
    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [initialized, session, runPeriodicVerification]);

  return {
    session,
    setSession,
    loading,
    setLoading,
    initialized,
  };
};
