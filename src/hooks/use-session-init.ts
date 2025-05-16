
import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionRestore } from './use-session-restore';
import { useAuthListener } from './use-auth-listener';
import { useCurrentSession } from './use-current-session';
import { isRefreshing } from '@/lib/supabase';

// Import our utility modules
import { validateSession } from './use-session/validation';
import { setupSessionEventListeners } from './use-session/event-handlers';
import { processSession } from './use-session/process-session';
import { setupPeriodicVerification } from './use-session/periodic-verification';
import { createSessionLogger } from './use-session/logging';

export const useSessionInit = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState(0);

  // Use the smaller, more focused hooks
  const { restoredSession, isRestoring } = useSessionRestore();
  const { sessionFromEvent, isListening } = useAuthListener();
  const { currentSession, isChecking } = useCurrentSession();

  // Create session logger
  const logSessionStatus = useCallback(
    createSessionLogger(
      isRestoring,
      isListening,
      isChecking,
      restoredSession,
      sessionFromEvent,
      currentSession,
      session,
      isRefreshing
    ),
    [
      isRestoring,
      isListening,
      isChecking,
      restoredSession,
      sessionFromEvent,
      currentSession,
      session,
      isRefreshing
    ]
  );

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

  // Process sessions callback
  const processSessions = useCallback(async () => {
    await processSession(
      sessionFromEvent,
      currentSession,
      restoredSession,
      isRestoring,
      isListening,
      isChecking,
      lastRefreshAttempt,
      setSession,
      setLoading,
      setInitialized,
      setLastRefreshAttempt
    );
  }, [
    restoredSession, 
    sessionFromEvent, 
    currentSession, 
    isRestoring, 
    isListening, 
    isChecking,
    lastRefreshAttempt
  ]);

  // Main effect for session processing
  useEffect(() => {
    let isMounted = true;
    
    const processSessionsWrapper = async () => {
      if (isMounted) {
        await processSessions();
      }
    };
    
    processSessionsWrapper();
    
    // Setup event listeners for session updates and removals
    const cleanupEventListeners = setupSessionEventListeners(setSession);
    
    return () => {
      isMounted = false;
      cleanupEventListeners();
    };
  }, [
    restoredSession, isRestoring,
    sessionFromEvent, isListening,
    currentSession, isChecking,
    processSessions
  ]);

  // Periodic session verification effect
  useEffect(() => {
    let isMounted = true;
    
    // Setup periodic verification
    const cleanupVerification = setupPeriodicVerification(
      initialized,
      session,
      setSession
    );
    
    return () => {
      isMounted = false;
      cleanupVerification();
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
