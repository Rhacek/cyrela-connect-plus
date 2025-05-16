
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
                
                // Store session data in localStorage for extra reliability
                if (event === 'SIGNED_IN') {
                  localStorage.setItem('sb-cbdytpkwalaoshbvxxri-auth-token', JSON.stringify({
                    access_token: currentSession.access_token,
                    refresh_token: currentSession.refresh_token,
                    expires_at: Math.floor(new Date(currentSession.expires_at).getTime() / 1000)
                  }));
                }
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing session");
              if (isMounted) {
                setSession(null);
                localStorage.removeItem('sb-cbdytpkwalaoshbvxxri-auth-token');
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
            localStorage.setItem('sb-cbdytpkwalaoshbvxxri-auth-token', JSON.stringify({
              access_token: supabaseSession.access_token,
              refresh_token: supabaseSession.refresh_token,
              expires_at: Math.floor(new Date(supabaseSession.expires_at).getTime() / 1000)
            }));
          }
        } else {
          console.log("No existing session found");
          
          // Try to recover session from localStorage as a backup
          try {
            const sessionStr = localStorage.getItem('sb-cbdytpkwalaoshbvxxri-auth-token');
            if (sessionStr) {
              const localSession = JSON.parse(sessionStr);
              if (localSession?.access_token && 
                  localSession.expires_at > Math.floor(Date.now() / 1000)) {
                console.log("Recovered session from localStorage");
                
                // Try to set the session manually and refresh
                await supabase.auth.setSession({
                  access_token: localSession.access_token,
                  refresh_token: localSession.refresh_token
                });
                
                // Get the session after setting it
                const { data: refreshData } = await supabase.auth.getSession();
                if (refreshData.session?.user && isMounted) {
                  console.log("Session refreshed successfully");
                  setSession(transformUserData(refreshData.session.user));
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
