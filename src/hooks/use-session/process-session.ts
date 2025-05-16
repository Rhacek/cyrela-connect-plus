
import { UserSession } from '@/types/auth';
import { refreshSession, isRefreshing } from '@/lib/supabase';
import { validateSession } from './validation';

// Handle an existing session with validation
export const handleExistingSession = async (
  sessionToUse: UserSession,
  lastRefreshAttempt: number,
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>,
  setLastRefreshAttempt: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  // Update the last refresh attempt timestamp
  setLastRefreshAttempt(Date.now());
  
  // Validate the session
  const isValid = await validateSession(sessionToUse, lastRefreshAttempt);
  
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

// Check if all session checks are complete
export const allSessionChecksComplete = (
  isRestoring: boolean,
  isListening: boolean,
  isChecking: boolean
): boolean => {
  return !isRestoring && isListening && !isChecking;
};

// Process session data from different sources
export const processSession = async (
  sessionFromEvent: UserSession | null,
  currentSession: UserSession | null,
  restoredSession: UserSession | null,
  isRestoring: boolean,
  isListening: boolean,
  isChecking: boolean,
  lastRefreshAttempt: number,
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>,
  setLastRefreshAttempt: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  // Prioritize session sources: auth events > current check > restore
  const sessionToUse = sessionFromEvent || currentSession || restoredSession;
  
  if (sessionToUse !== null) {
    await handleExistingSession(sessionToUse, lastRefreshAttempt, setSession, setLastRefreshAttempt);
  } else if (allSessionChecksComplete(isRestoring, isListening, isChecking)) {
    // If all checks are complete and we don't have a session, clear it
    console.log("All session checks complete, no valid session found");
    setSession(null);
  }
  
  // Mark as not loading when all checks are complete
  if (allSessionChecksComplete(isRestoring, isListening, isChecking)) {
    console.log("All session checks complete, setting loading=false");
    setLoading(false);
    setInitialized(true);
  }
};
