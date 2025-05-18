
import { useState, useEffect } from 'react';
import { supabase, sessionEvent, SESSION_UPDATED, SESSION_REMOVED } from '@/lib/supabase';
import { transformUserData } from '@/utils/auth-utils';
import { UserSession } from '@/types/auth';

export function useAuthListener() {
  const [sessionFromEvent, setSessionFromEvent] = useState<UserSession | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    console.log("Setting up auth state change listener");
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event}`, session?.user?.id);
      
      // Process auth events of interest
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session && isMounted) {
          console.log(`Processing auth event ${event} with user ${session.user.id}`);
          
          // Transform the user data to our UserSession format
          const userSession = await transformUserData(session.user);
          setSessionFromEvent(userSession);
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          console.log("User signed out, clearing session");
          setSessionFromEvent(null);
        }
      }
    });
    
    // Subscribe to custom session events
    const handleSessionUpdate = async (event: any) => {
      if (isMounted && event.detail?.session) {
        console.log("Received session update event");
        const userSession = await transformUserData(event.detail.session.user);
        setSessionFromEvent(userSession);
      }
    };
    
    const handleSessionRemoval = () => {
      if (isMounted) {
        console.log("Received session removal event");
        setSessionFromEvent(null);
      }
    };
    
    sessionEvent.addEventListener(SESSION_UPDATED, handleSessionUpdate);
    sessionEvent.addEventListener(SESSION_REMOVED, handleSessionRemoval);
    
    setIsListening(true);
    
    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state change listener");
      isMounted = false;
      subscription.unsubscribe();
      sessionEvent.removeEventListener(SESSION_UPDATED, handleSessionUpdate);
      sessionEvent.removeEventListener(SESSION_REMOVED, handleSessionRemoval);
      setIsListening(false);
    };
  }, []);

  return { sessionFromEvent, isListening };
}
