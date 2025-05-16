
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These values are already set by the Lovable-Supabase integration
const supabaseUrl = "https://cbdytpkwalaoshbvxxri.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZHl0cGt3YWxhb3NoYnZ4eHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzM5MjcsImV4cCI6MjA2Mjg0OTkyN30.bXu9Bi6kSxgCnY8uD64Ez_dRash8UT6ar0J_-UP4fVI";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'implicit'
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

// Clear any expired sessions on load
export const cleanupExpiredSessions = () => {
  try {
    // Check if there's a session in localStorage and if it's expired
    const sessionString = localStorage.getItem('sb-cbdytpkwalaoshbvxxri-auth-token');
    if (sessionString) {
      const session = JSON.parse(sessionString);
      if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
        // Session expired, remove it
        localStorage.removeItem('sb-cbdytpkwalaoshbvxxri-auth-token');
        console.log("Removed expired session token");
      }
    }
  } catch (e) {
    console.error("Error cleaning up expired sessions:", e);
  }
};

// Initialize auth cleanup
cleanupExpiredSessions();

// Force restoration of session from localStorage on app load
export const forceSessionRestore = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error restoring session:", error);
      return null;
    }
    
    if (!data.session) {
      console.log("No session found through getSession, trying localStorage");
      
      // Attempt direct localStorage recovery - using the correct Supabase storage key
      try {
        const storedSession = localStorage.getItem('sb-cbdytpkwalaoshbvxxri-auth-token');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          
          if (parsedSession && 
              parsedSession.access_token && 
              parsedSession.expires_at && 
              new Date(parsedSession.expires_at * 1000) > new Date()) {
            
            console.log("Found valid session in localStorage, attempting to restore");
            
            // Try to set the session manually and refresh
            await supabase.auth.setSession({
              access_token: parsedSession.access_token,
              refresh_token: parsedSession.refresh_token
            });
            
            // Get the session after setting it
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              console.log("Session successfully restored manually");
              return sessionData.session;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing localStorage session:", e);
      }
    } else {
      console.log("Session found through getSession:", data.session.user.id);
    }
    
    return data.session;
  } catch (e) {
    console.error("Error in forceSessionRestore:", e);
    return null;
  }
};
