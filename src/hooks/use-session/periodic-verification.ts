
import { supabase, refreshSession, isRefreshing } from '@/lib/supabase';
import { UserSession } from '@/types/auth';

// Handle invalid session during verification
export const handleInvalidSession = async (
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>
): Promise<void> => {
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

// Run periodic session verification
export const runPeriodicVerification = async (
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>
): Promise<void> => {
  // Skip checks if a refresh is already in progress
  if (isRefreshing) {
    console.log("Skipping periodic check - refresh already in progress");
    return;
  }
  
  console.log("Performing periodic session verification check");
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      await handleInvalidSession(setSession);
    } else {
      console.log("Periodic check: Session still valid");
    }
  } catch (err) {
    console.error("Error during periodic session check:", err);
  }
};

// Create a function to set up periodic verification
export const setupPeriodicVerification = (
  initialized: boolean,
  session: UserSession | null,
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>
): (() => void) => {
  let intervalId: number | null = null;
  
  if (initialized && session) {
    // Verify session every 20 minutes
    intervalId = window.setInterval(() => {
      runPeriodicVerification(setSession);
    }, 20 * 60 * 1000); // 20 minutes
  }
  
  // Return a cleanup function
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
};
