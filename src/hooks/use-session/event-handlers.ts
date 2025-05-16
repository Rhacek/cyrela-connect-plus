
import { refreshSession, sessionEvent, SESSION_UPDATED, SESSION_REMOVED } from '@/lib/supabase';
import { UserSession } from '@/types/auth';
import { transformUserData } from '@/utils/auth-utils';
import { Dispatch, SetStateAction } from 'react';

// Handle session updates from event listeners
export const createSessionUpdateHandler = (
  setSession: Dispatch<SetStateAction<UserSession | null>>
) => {
  return (event: any) => {
    if (event.detail?.session) {
      console.log("Session context received session update event");
      const userSession = transformUserData(event.detail.session.user);
      setSession(userSession);
    }
  };
};

// Handle session removal events
export const createSessionRemovalHandler = (
  setSession: Dispatch<SetStateAction<UserSession | null>>
) => {
  return () => {
    console.log("Session context received session removal event");
    setSession(null);
  };
};

// Setup event listeners for session updates and removals
export const setupSessionEventListeners = (
  setSession: Dispatch<SetStateAction<UserSession | null>>
) => {
  const handleSessionUpdate = createSessionUpdateHandler(setSession);
  const handleSessionRemoval = createSessionRemovalHandler(setSession);
  
  sessionEvent.addEventListener(SESSION_UPDATED, handleSessionUpdate);
  sessionEvent.addEventListener(SESSION_REMOVED, handleSessionRemoval);
  
  // Return a cleanup function
  return () => {
    sessionEvent.removeEventListener(SESSION_UPDATED, handleSessionUpdate);
    sessionEvent.removeEventListener(SESSION_REMOVED, handleSessionRemoval);
  };
};
