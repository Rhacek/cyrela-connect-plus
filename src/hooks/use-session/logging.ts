
import { UserSession } from '@/types/auth';

// Logging helper function for development environment
export const createSessionLogger = (
  isRestoring: boolean,
  isListening: boolean,
  isChecking: boolean,
  restoredSession: UserSession | null,
  sessionFromEvent: UserSession | null,
  currentSession: UserSession | null,
  session: UserSession | null,
  isRefreshing: boolean
) => {
  return () => {
    if (process.env.NODE_ENV === 'development') {
      console.log("useSessionInit status:", {
        isRestoring,
        isListening,
        isChecking,
        hasRestoredSession: !!restoredSession,
        hasEventSession: !!sessionFromEvent,
        hasCurrentSession: !!currentSession,
        sessionId: session?.id,
        isRefreshing
      });
    }
  };
};
