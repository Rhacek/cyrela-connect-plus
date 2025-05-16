
import { supabase, storageKey } from './client';

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
    return data.session;
  } catch (error) {
    console.error("Unexpected error getting session:", error);
    return null;
  }
};

// Verify session validity more thoroughly
export const verifySession = async (session: any) => {
  if (!session) return false;
  
  try {
    // Check if the session has a valid access token
    if (!session.access_token) {
      console.log("Session missing access token");
      return false;
    }
    
    // Verify the session by checking user data
    const { data, error } = await supabase.auth.getUser(session.access_token);
    
    if (error) {
      console.error("Error verifying session:", error);
      return false;
    }
    
    if (data.user) {
      console.log("Session verified with valid user");
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
    
    // Check if we successfully cleared everything
    const sessionCheck = await getCurrentSession();
    if (sessionCheck) {
      console.warn("Session still exists after logout, forcing removal");
      localStorage.clear(); // More aggressive cleanup
    } else {
      console.log("Signout successful, no session remains");
    }
    
    return { success: true };
  } catch (e) {
    console.error("Error in signOutAndCleanup:", e);
    
    // Even if there's an error, try to clear localStorage
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
    
    return { success: false, error: e };
  }
};
