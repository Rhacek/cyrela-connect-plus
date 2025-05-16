
import { useEffect, useState } from 'react';
import { supabase, forceSessionRestore } from '@/lib/supabase';
import { transformUserData } from '@/utils/auth-utils';
import { UserSession } from '@/types/auth';

export const useSessionInit = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    
    const initialize = async () => {
      try {
        // First forcibly try to restore any existing session
        const existingSession = await forceSessionRestore();
        if (existingSession?.user && isMounted) {
          console.log("Pre-initialization: restored session for user:", existingSession.user.id);
          setSession(transformUserData(existingSession.user));
        }
        
        // Set up the auth state listener
        const { data } = await supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event);
            if (currentSession?.user) {
              console.log("Setting session from auth state change:", currentSession.user.id);
              if (isMounted) {
                setSession(transformUserData(currentSession.user));
                
                // Store for extra reliability, only if this isn't a token refresh
                if (event !== 'TOKEN_REFRESHED') {
                  localStorage.setItem('supabase.auth.token', JSON.stringify({
                    currentSession: currentSession,
                    expiresAt: Math.floor(Date.now() / 1000) + currentSession.expires_in
                  }));
                }
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing session");
              if (isMounted) {
                setSession(null);
                localStorage.removeItem('supabase.auth.token');
              }
            }
            
            if (isMounted) {
              setLoading(false);
            }
          }
        );

        subscription = data.subscription;

        // Then check for existing session
        const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (supabaseSession?.user) {
          console.log("Found existing session:", supabaseSession.user.id);
          if (isMounted) {
            setSession(transformUserData(supabaseSession.user));
            
            // Store session data in localStorage for backup recovery
            localStorage.setItem('supabase.auth.token', JSON.stringify({
              currentSession: supabaseSession,
              expiresAt: Math.floor(Date.now() / 1000) + supabaseSession.expires_in
            }));
          }
        } else {
          console.log("No existing session found");
          
          // Try to recover session from localStorage as a backup
          try {
            const sessionStr = localStorage.getItem('supabase.auth.token');
            if (sessionStr) {
              const localSession = JSON.parse(sessionStr);
              if (localSession?.currentSession?.user && 
                  localSession.expiresAt > Math.floor(Date.now() / 1000)) {
                console.log("Recovered session from localStorage");
                if (isMounted) {
                  setSession(transformUserData(localSession.currentSession.user));
                  
                  // Attempt to refresh the token to ensure it's valid
                  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                  if (!refreshError && refreshData.session) {
                    console.log("Session refreshed successfully");
                    setSession(transformUserData(refreshData.session.user));
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error recovering session from localStorage:", err);
          }
        }
        
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      } catch (err) {
        console.error("Error during auth initialization:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return {
    session,
    setSession,
    loading,
    setLoading,
    initialized,
  };
};
