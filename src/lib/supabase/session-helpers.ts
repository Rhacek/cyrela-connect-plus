
import { supabase } from './client';
import { getCurrentSession } from './auth-helpers';

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
      const storedSession = localStorage.getItem('sb-cbdytpkwalaoshbvxxri-auth-token');
      
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
              localStorage.removeItem('sb-cbdytpkwalaoshbvxxri-auth-token');
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
