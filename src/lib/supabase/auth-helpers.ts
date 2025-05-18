
import { supabase, SESSION_UPDATED, SESSION_REMOVED, emitSessionUpdate, emitSessionRemoval } from '@/integrations/supabase/client';
import { UserSession } from '@/types/auth';
import { transformUserData } from '@/utils/auth-utils';

/**
 * Logs the current auth state for debugging purposes
 */
export const logAuthState = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("Current auth state:", {
      hasSession: !!data.session,
      error: error?.message
    });
    return data.session;
  } catch (err) {
    console.error("Error logging auth state:", err);
    return null;
  }
};

/**
 * Gets the current Supabase session
 */
export const getCurrentSession = async (): Promise<UserSession | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting current session:", error);
      return null;
    }
    
    if (!data.session) {
      console.log("No current session found");
      return null;
    }
    
    const user = data.session.user;
    const userSession = transformUserData(user);
    
    // Add token information
    userSession.access_token = data.session.access_token;
    userSession.refresh_token = data.session.refresh_token;
    userSession.expires_at = data.session.expires_at;
    
    return userSession;
  } catch (err) {
    console.error("Error in getCurrentSession:", err);
    return null;
  }
};

/**
 * Verifies if the current session is valid
 * @returns boolean indicating if session is valid
 */
export const verifySession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error verifying session:", error);
      return false;
    }
    
    const isValid = !!data.session;
    
    if (!isValid) {
      // Try refreshing the session if it's invalid
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          console.log("Session refresh failed:", refreshError?.message || "No new session");
          emitSessionRemoval();
          return false;
        }
        
        console.log("Session refreshed successfully");
        // Notify components that session was updated
        emitSessionUpdate(refreshData.session);
        return true;
      } catch (refreshErr) {
        console.error("Error refreshing session:", refreshErr);
        return false;
      }
    }
    
    return isValid;
  } catch (err) {
    console.error("Unexpected error in verifySession:", err);
    return false;
  }
};

/**
 * Enhanced sign out that cleans up all application state
 */
export const signOutAndCleanup = async (): Promise<{ success: boolean; error?: Error }> => {
  try {
    console.log("Starting signOutAndCleanup process");
    
    // Clear any local session stores first
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('currentSession');
      sessionStorage.removeItem('lastAuthCheck');
      sessionStorage.removeItem('sessionCache');
    } catch (err) {
      console.warn("Error clearing local storage:", err);
      // Continue despite errors with storage
    }
    
    // Then sign out with Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Supabase signOut error:", error);
      return { success: false, error };
    }
    
    // Emit a session removal event to notify all components
    emitSessionRemoval();
    
    console.log("Sign out completed successfully");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in signOutAndCleanup:", err);
    return { success: false, error: err as Error };
  }
};
