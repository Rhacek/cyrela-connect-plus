
import { supabase, storageKey, emitSessionRemoval, emitSessionUpdate, refreshSession } from '@/integrations/supabase/client';
import { UserSession } from '@/types/auth';

// Helper to log auth state for debugging
export const logAuthState = async () => {
  const { data } = await supabase.auth.getSession();
  console.log("Current auth session:", data.session);
  return data.session;
};

// Enhanced get current user function with session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    
    if (!data.session) {
      console.log("No active session found via getSession");
      return null;
    }
    
    console.log("Found active session for user:", data.session.user.id);
    return data.session;
  } catch (error) {
    console.error("Unexpected error getting session:", error);
    return null;
  }
};

// Verify session validity more thoroughly with explicit token checks
export const verifySession = async (session: any) => {
  if (!session) return false;
  
  try {
    // Check if the session has a valid access token
    if (!session.access_token) {
      console.log("Session missing access token");
      return false;
    }
    
    // Check for token expiration if expires_at is available
    if (session.expires_at) {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = session.expires_at - currentTimeInSeconds;
      
      // If token is expired or about to expire in the next minute, try to refresh
      if (timeUntilExpiry <= 60) {
        console.log("Access token expired or about to expire, attempting refresh");
        const refreshedSession = await refreshSession();
        return !!refreshedSession;
      }
    }
    
    // Verify the session by checking user data
    const { data, error } = await supabase.auth.getUser(session.access_token);
    
    if (error) {
      console.error("Error verifying session:", error);
      return false;
    }
    
    if (data.user) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Unexpected error verifying session:", error);
    return false;
  }
};

// Improved logout function that cleans up everything
export const signOutAndCleanup = async () => {
  try {
    console.log("Starting full signout and cleanup");
    
    // First, sign out through Supabase
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error("Error during signout:", error);
    }
    
    // Manually clear localStorage regardless of the signOut result
    localStorage.removeItem(storageKey);
    
    // Also clear any other auth-related items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth') || key.includes('session'))) {
        localStorage.removeItem(key);
      }
    }
    
    // Clear sessionStorage as well for completeness
    sessionStorage.removeItem('lastAuthCheck');
    
    // Emit session removal event
    emitSessionRemoval();
    
    // Double-check if we successfully cleared everything
    const sessionCheck = await getCurrentSession();
    if (sessionCheck) {
      console.warn("Session still exists after logout, forcing removal");
      try {
        // One more attempt to clear storage
        localStorage.clear();
      } catch (e) {
        console.error("Error clearing localStorage:", e);
      }
    } else {
      console.log("Signout successful, no session remains");
    }
    
    return { success: true };
  } catch (e) {
    console.error("Error in signOutAndCleanup:", e);
    
    // Even if there's an error, try to clear localStorage
    try {
      localStorage.removeItem(storageKey);
      emitSessionRemoval();
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
    
    return { success: false, error: e };
  }
};
