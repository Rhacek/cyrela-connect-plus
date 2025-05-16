
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

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Try to restore session from Supabase or localStorage
        const existingSession = await forceSessionRestore();
        
        if (existingSession?.user) {
          console.log("Session restored for user:", existingSession.user.id);
          setRestoredSession(transformUserData(existingSession.user));
        } else {
          console.log("No session could be restored");
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  return { restoredSession, isRestoring };
};
