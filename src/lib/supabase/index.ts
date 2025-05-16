
// Export all the functions from the different modules
export { 
  supabase, 
  storageKey, 
  refreshSession, 
  sessionEvent, 
  SESSION_UPDATED, 
  SESSION_REMOVED,
  emitSessionUpdate,
  emitSessionRemoval
} from './client';

export { 
  logAuthState, 
  getCurrentSession,
  verifySession, 
  signOutAndCleanup 
} from './auth-helpers';

export { 
  forceSessionRestore, 
  initializeSession 
} from './session-helpers';

// Call initialization
import { initializeSession } from './session-helpers';

initializeSession().catch(err => {
  console.error("Error during session initialization:", err);
});
