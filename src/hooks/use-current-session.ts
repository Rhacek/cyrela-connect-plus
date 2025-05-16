
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { transformUserData } from '@/utils/auth-utils';

/**
 * Hook to check for an existing session with Supabase
 */
export const useCurrentSession = () => {
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkCurrentSession = async () => {
      try {
        // Check for existing session
        const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setIsChecking(false);
          }
          return;
        }

        if (supabaseSession?.user) {
          console.log("Found existing session:", supabaseSession.user.id);
          if (isMounted) {
            setCurrentSession(transformUserData(supabaseSession.user));
            
            // Store session data in localStorage for backup recovery
            localStorage.setItem('sb-cbdytpkwalaoshbvxxri-auth-token', JSON.stringify({
              access_token: supabaseSession.access_token,
              refresh_token: supabaseSession.refresh_token,
              expires_at: Math.floor(new Date(supabaseSession.expires_at).getTime() / 1000)
            }));
          }
        } else {
          console.log("No existing session found");
        }
        
        if (isMounted) {
          setIsChecking(false);
        }
      } catch (err) {
        console.error("Error checking current session:", err);
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    checkCurrentSession();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { currentSession, isChecking };
};
