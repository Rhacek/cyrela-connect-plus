
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { transformUserData } from '@/utils/auth-utils';

/**
 * Hook to listen for authentication state changes
 */
export const useAuthListener = () => {
  const [sessionFromEvent, setSessionFromEvent] = useState<UserSession | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const setupAuthListener = async () => {
      try {
        // Set up the auth state listener
        const { data } = await supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event);
            
            if (currentSession?.user) {
              console.log("Setting session from auth state change:", currentSession.user.id);
              if (isMounted) {
                setSessionFromEvent(transformUserData(currentSession.user));
                
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
                setSessionFromEvent(null);
                localStorage.removeItem('sb-cbdytpkwalaoshbvxxri-auth-token');
              }
            }
            
            if (isMounted) {
              setIsListening(true);
            }
          }
        );

        return data.subscription;
      } catch (err) {
        console.error("Error setting up auth listener:", err);
        setIsListening(true);
        return null;
      }
    };
    
    const subscription = setupAuthListener();
    
    return () => {
      isMounted = false;
      subscription.then(sub => {
        if (sub) {
          sub.unsubscribe();
        }
      });
    };
  }, []);

  return { sessionFromEvent, isListening };
};
