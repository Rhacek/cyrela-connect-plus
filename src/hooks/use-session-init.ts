
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        // First set up the auth state listener
        const { data } = await supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event);
            if (currentSession?.user) {
              console.log("Setting session from auth state change:", currentSession.user.id);
              if (isMounted) {
                setSession(transformUserData(currentSession.user));
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing session");
              if (isMounted) {
                setSession(null);
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
