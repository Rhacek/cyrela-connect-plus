
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { transformUserData } from '@/utils/auth-utils';
import { UserSession } from '@/types/auth';

export function useAuthListener() {
  const [sessionFromEvent, setSessionFromEvent] = useState<UserSession | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    console.log("Setting up auth state change listener");
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event}`, session?.user?.id);
      
      // Process auth events of interest
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session && isMounted) {
          console.log(`Processing auth event ${event} with user ${session.user.id}`);
          
          // Transform the user data to our UserSession format
          const userSession = transformUserData(session.user);
          setSessionFromEvent(userSession);
          
          // Store session metadata if needed
          const metadata = session.user.user_metadata;
          if (metadata) {
            console.log("Updating session with metadata:", metadata);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          console.log("User signed out, clearing session");
          setSessionFromEvent(null);
        }
      }
    });
    
    setIsListening(true);
    
    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state change listener");
      isMounted = false;
      subscription.unsubscribe();
      setIsListening(false);
    };
  }, []);

  return { sessionFromEvent, isListening };
}
