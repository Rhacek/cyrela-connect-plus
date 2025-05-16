
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These values are already set by the Lovable-Supabase integration
const supabaseUrl = "https://cbdytpkwalaoshbvxxri.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZHl0cGt3YWxhb3NoYnZ4eHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzM5MjcsImV4cCI6MjA2Mjg0OTkyN30.bXu9Bi6kSxgCnY8uD64Ez_dRash8UT6ar0J_-UP4fVI";

// Explicitly set storage key to ensure consistent storage
export const storageKey = 'sb-cbdytpkwalaoshbvxxri-auth-token';

// Create a single instance of the Supabase client with optimized auth settings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storageKey: storageKey,
    debug: false // Disable debug mode to reduce noise
  }
});

// Create a custom event for session state changes
export const sessionEvent = new EventTarget();
export const SESSION_UPDATED = 'SESSION_UPDATED';
export const SESSION_REMOVED = 'SESSION_REMOVED';

// Helper to emit session update events
export function emitSessionUpdate(session: any | null) {
  const event = new CustomEvent(SESSION_UPDATED, { detail: { session } });
  sessionEvent.dispatchEvent(event);
}

// Helper to emit session removal events
export function emitSessionRemoval() {
  const event = new CustomEvent(SESSION_REMOVED);
  sessionEvent.dispatchEvent(event);
}

// Centralized token refresh function
export async function refreshSession() {
  // Use a lock to prevent multiple refresh attempts
  const isRefreshing = false; // Using a simpler version without the lock for now
  
  try {
    console.log("Attempting to refresh token");
    
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing session:", error.message);
      return null;
    }
    
    if (data?.session) {
      console.log("Token refreshed successfully");
      emitSessionUpdate(data.session);
      return data.session;
    }
    
    return null;
  } catch (err) {
    console.error("Unexpected error during token refresh:", err);
    return null;
  }
}

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
    
    // Emit session removal event
    emitSessionRemoval();
    
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

// Enhanced session restore with additional checks and retries
export const forceSessionRestore = async (retryCount = 0) => {
  try {
    console.log(`Attempting to restore session (attempt ${retryCount + 1})...`);
    
    // First try the standard getSession method
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error restoring session:", error);
      return null;
    }
    
    if (data.session) {
      console.log("Session found through getSession:", data.session.user.id);
      return data.session;
    }
    
    console.log("No session found through getSession, trying manual recovery");
    
    // Attempt to recover session from localStorage manually
    try {
      const storedSession = localStorage.getItem(storageKey);
      
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        
        if (parsedSession && 
            parsedSession.access_token && 
            parsedSession.refresh_token) {
          
          console.log("Found session data in localStorage, attempting to restore");
          
          // Try to set the session manually and refresh
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: parsedSession.access_token,
            refresh_token: parsedSession.refresh_token
          });
          
          if (setSessionError) {
            console.error("Error setting session manually:", setSessionError);
            
            // If the tokens are expired, try to clear them to avoid future errors
            if (setSessionError.message.includes("token is expired")) {
              console.log("Tokens expired, clearing localStorage");
              localStorage.removeItem(storageKey);
            }
            
            return null;
          }
          
          if (sessionData.session) {
            console.log("Session successfully restored manually");
            return sessionData.session;
          }
        } else {
          console.log("Stored session is invalid or missing tokens");
        }
      } else {
        console.log("No session found in localStorage");
      }
    } catch (e) {
      console.error("Error parsing localStorage session:", e);
    }
    
    // Try token refresh as last resort
    try {
      console.log("Attempting token refresh as last resort");
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Error refreshing session:", refreshError);
        return null;
      }
      
      if (refreshData.session) {
        console.log("Session refreshed successfully");
        return refreshData.session;
      }
    } catch (refreshErr) {
      console.error("Error refreshing session:", refreshErr);
    }
    
    // If we've retried less than 2 times and still failed, try again
    if (retryCount < 2) {
      console.log(`Retry attempt ${retryCount + 1}...`);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return forceSessionRestore(retryCount + 1);
    }
    
    return null;
  } catch (e) {
    console.error("Error in forceSessionRestore:", e);
    return null;
  }
};

// Initialize session on module load
export const initializeSession = async () => {
  const session = await forceSessionRestore();
  if (session) {
    console.log("Session initialized on module load");
  } else {
    console.log("No session found during initialization");
  }
};

// Call initialization
initializeSession().catch(err => {
  console.error("Error during session initialization:", err);
});
