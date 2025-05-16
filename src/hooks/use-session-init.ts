
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
    
    const initialize = async () => {
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
        }
        
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
        
        return () => {
          subscription.unsubscribe();
        };
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
