
import { supabase, storageKey, emitSessionUpdate } from '@/integrations/supabase/client';
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
      
      // Verify session expiration
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (data.session.expires_at && data.session.expires_at > currentTimeInSeconds) {
        console.log("Session is valid, expires in:", 
          (data.session.expires_at - currentTimeInSeconds), "seconds");
        emitSessionUpdate(data.session);
        return data.session;
      } else if (data.session.expires_at) {
        console.log("Session is expired, attempting refresh");
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (!refreshError && refreshData.session) {
          console.log("Session refreshed successfully");
          emitSessionUpdate(refreshData.session);
          return refreshData.session;
        }
      } else {
        // If no expiration is provided, trust the session
        emitSessionUpdate(data.session);
        return data.session;
      }
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
            emitSessionUpdate(sessionData.session);
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

// Initialize session on module load with enhanced logging
export const initializeSession = async () => {
  console.log("Starting session initialization...");
  const session = await forceSessionRestore();
  
  if (session) {
    console.log("Session initialized successfully for user:", session.user.id);
    // Store user ID in sessionStorage for cross-tab synchronization
    try {
      sessionStorage.setItem('current_user_id', session.user.id);
    } catch (err) {
      console.error("Error storing user ID in sessionStorage:", err);
    }
  } else {
    console.log("No session found during initialization");
    // Clear sessionStorage marker
    try {
      sessionStorage.removeItem('current_user_id');
    } catch (err) {
      console.error("Error removing user ID from sessionStorage:", err);
    }
  }
  
  return session;
};
