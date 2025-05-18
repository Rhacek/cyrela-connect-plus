
import { SESSION_UPDATED, SESSION_REMOVED, sessionEvent } from '@/lib/supabase';
import { transformUserData } from '@/utils/auth-utils';

/**
 * Sets up event listeners for session updates and removals
 */
export const setupSessionEventListeners = (
  setSession: (session: any) => void
) => {
  // Handle session updates from custom events
  const handleSessionUpdate = async (event: any) => {
    console.log('Session update event received');
    if (event.detail?.session) {
      const userSession = await transformUserData(event.detail.session.user);
      setSession(userSession);
    }
  };

  // Handle session removals from custom events
  const handleSessionRemoval = () => {
    console.log('Session removal event received');
    setSession(null);
  };

  // Add event listeners
  sessionEvent.addEventListener(SESSION_UPDATED, handleSessionUpdate);
  sessionEvent.addEventListener(SESSION_REMOVED, handleSessionRemoval);

  // Return cleanup function
  return () => {
    sessionEvent.removeEventListener(SESSION_UPDATED, handleSessionUpdate);
    sessionEvent.removeEventListener(SESSION_REMOVED, handleSessionRemoval);
  };
};
