
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
        console.log("Setting up auth state listener...");
        
        // Set up the auth state listener
        const { data } = await supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event);
            
            if (!isMounted) return;
            
            if (currentSession?.user) {
              console.log("Auth event with session, user:", currentSession.user.id);
              setSessionFromEvent(transformUserData(currentSession.user));
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing session");
              setSessionFromEvent(null);
            } else {
              console.log(`Auth event '${event}' without valid session`);
            }
            
            setIsListening(true);
          }
        );

        return data.subscription;
      } catch (err) {
        console.error("Error setting up auth listener:", err);
        if (isMounted) {
          setIsListening(true);
        }
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
