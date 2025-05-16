
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

  // Combine the results from all hooks
  useEffect(() => {
    // If we have a session from any source, use it
    const sessionToUse = sessionFromEvent || currentSession || restoredSession;
    
    if (sessionToUse !== null) {
      setSession(sessionToUse);
    }
    
    // Mark as not loading when all checks are complete
    if (!isRestoring && isListening && !isChecking) {
      setLoading(false);
      setInitialized(true);
    }
  }, [
    restoredSession, isRestoring,
    sessionFromEvent, isListening,
    currentSession, isChecking
  ]);

  return {
    session,
    setSession,
    loading,
    setLoading,
    initialized,
  };
};
