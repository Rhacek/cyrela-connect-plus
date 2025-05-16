
import { useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionRestore } from './use-session-restore';
import { useAuthListener } from './use-auth-listener';
import { useCurrentSession } from './use-current-session';

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

  // Combine the results from all hooks
  useEffect(() => {
    // If we have a session from any source, use it
    // Priority: auth events > current check > restore (localStorage)
    const sessionToUse = sessionFromEvent || currentSession || restoredSession;
    
    if (sessionToUse !== null) {
      console.log("Setting session from source, user:", sessionToUse.id);
      setSession(sessionToUse);
    } else if (!isRestoring && !isChecking && isListening) {
      // If all checks are complete and we don't have a session, clear it
      console.log("All session checks complete, no session found");
      setSession(null);
    }
    
    // Mark as not loading when all checks are complete
    if (!isRestoring && isListening && !isChecking) {
      console.log("All session checks complete, setting loading=false");
      setLoading(false);
      setInitialized(true);
    }
  }, [
    restoredSession, isRestoring,
    sessionFromEvent, isListening,
    currentSession, isChecking
  ]);

  // Periodic session check to ensure it's still valid
  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (initialized && session) {
      // Check session validity every 5 minutes
      intervalId = window.setInterval(async () => {
        if (!isMounted) return;
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.warn("Periodic check: Session lost, attempting to refresh");
            
            // Try to refresh the session
            const { data: refreshData } = await supabase.auth.refreshSession();
            
            if (!refreshData.session && isMounted) {
              console.warn("Session refresh failed, clearing session");
              setSession(null);
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

// Import at the top
import { supabase } from '@/lib/supabase';
