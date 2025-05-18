
import { forceSessionRestore } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { transformUserData } from '@/utils/auth-utils';

/**
 * Hook to handle session restoration from localStorage or Supabase
 */
export const useSessionRestore = () => {
  const [restoredSession, setRestoredSession] = useState<UserSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 2;

  useEffect(() => {
    let isMounted = true;
    
    const restoreSession = async () => {
      try {
        console.log(`Attempting to restore session (attempt ${attempts + 1}/${MAX_ATTEMPTS})`);
        
        // Try to restore session from Supabase or localStorage
        const existingSession = await forceSessionRestore();
        
        if (existingSession?.user) {
          console.log("Session restored successfully for user:", existingSession.user.id);
          
          if (isMounted) {
            const userSession = await transformUserData(existingSession.user);
            setRestoredSession(userSession);
            setIsRestoring(false);
          }
        } else {
          console.log("No session could be restored on this attempt");
          
          // Try again if we haven't reached max attempts
          if (attempts < MAX_ATTEMPTS - 1 && isMounted) {
            setAttempts(prev => prev + 1);
            // Retry after a short delay
            setTimeout(() => {
              if (isMounted) restoreSession();
            }, 1000);
          } else {
            if (isMounted) {
              console.log("Max restoration attempts reached, giving up");
              setIsRestoring(false);
            }
          }
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        if (isMounted) {
          setIsRestoring(false);
        }
      }
    };

    restoreSession();
    
    return () => {
      isMounted = false;
    };
  }, [attempts]);

  return { restoredSession, isRestoring };
};
