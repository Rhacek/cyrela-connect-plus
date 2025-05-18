
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
        console.log("Checking for current session...");
        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setIsChecking(false);
          }
          return;
        }

        if (data.session?.user) {
          console.log("Found existing session for user:", data.session.user.id);
          if (isMounted) {
            const userSession = await transformUserData(data.session.user);
            setCurrentSession(userSession);
          }
        } else {
          console.log("No existing session found via getSession");
          
          // Optionally try to refresh session
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.log("Session refresh failed:", refreshError.message);
            } else if (refreshData.session) {
              console.log("Session refreshed successfully");
              if (isMounted) {
                const userSession = await transformUserData(refreshData.session.user);
                setCurrentSession(userSession);
              }
            }
          } catch (refreshErr) {
            console.error("Error refreshing session:", refreshErr);
          }
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
