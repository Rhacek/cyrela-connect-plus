
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

// Clear any expired sessions
export const cleanupExpiredSessions = () => {
  try {
    const sessionString = localStorage.getItem('supabase.auth.token');
    if (sessionString) {
      const session = JSON.parse(sessionString);
      if (session.expiresAt && session.expiresAt < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('supabase.auth.token');
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
      
      // Attempt direct localStorage recovery
      try {
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession && 
              parsedSession.currentSession && 
              parsedSession.expiresAt && 
              parsedSession.expiresAt > Math.floor(Date.now() / 1000)) {
            
            console.log("Found valid session in localStorage, attempting to restore");
            
            // Try to refresh the session
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.error("Error refreshing session:", refreshError);
            } else if (refreshData.session) {
              console.log("Session successfully restored from refresh");
              return refreshData.session;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing localStorage session:", e);
      }
    }
    
    return data.session;
  } catch (e) {
    console.error("Error in forceSessionRestore:", e);
    return null;
  }
};
