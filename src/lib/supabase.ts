
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These values are already set by the Lovable-Supabase integration
const supabaseUrl = "https://cbdytpkwalaoshbvxxri.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZHl0cGt3YWxhb3NoYnZ4eHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzM5MjcsImV4cCI6MjA2Mjg0OTkyN30.bXu9Bi6kSxgCnY8uD64Ez_dRash8UT6ar0J_-UP4fVI";

// Explicitly set storage key and ensure proper session handling
const storageKey = 'sb-cbdytpkwalaoshbvxxri-auth-token';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storageKey: storageKey
  }
});

// Helper to log auth state for debugging
export const logAuthState = async () => {
  const { data } = await supabase.auth.getSession();
  console.log("Current auth session:", data.session);
  return data.session;
};

// Helper function to get current user with session
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting user:", error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Unexpected error getting user:", error);
    return null;
  }
};

// Improved session restore function with additional checks
export const forceSessionRestore = async () => {
  try {
    console.log("Attempting to restore session...");
    
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
            parsedSession.refresh_token && 
            parsedSession.expires_at && 
            new Date(parsedSession.expires_at * 1000) > new Date()) {
          
          console.log("Found valid session in localStorage, attempting to restore");
          
          // Try to set the session manually and refresh
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: parsedSession.access_token,
            refresh_token: parsedSession.refresh_token
          });
          
          if (setSessionError) {
            console.error("Error setting session manually:", setSessionError);
            return null;
          }
          
          if (sessionData.session) {
            console.log("Session successfully restored manually");
            return sessionData.session;
          }
        } else {
          console.log("Stored session is invalid or expired");
        }
      } else {
        console.log("No session found in localStorage");
      }
    } catch (e) {
      console.error("Error parsing localStorage session:", e);
    }
    
    // Try one last resort - refresh token
    try {
      console.log("Attempting token refresh as last resort");
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (refreshData.session) {
        console.log("Session refreshed successfully");
        return refreshData.session;
      }
    } catch (refreshErr) {
      console.error("Error refreshing session:", refreshErr);
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
