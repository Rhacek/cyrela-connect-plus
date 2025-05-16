// Re-export the Supabase client from the integrations folder
// This centralizes our Supabase client to a single implementation
export { 
  supabase, 
  storageKey, 
  refreshSession, 
  sessionEvent, 
  SESSION_UPDATED, 
  SESSION_REMOVED,
  emitSessionUpdate,
  emitSessionRemoval,
  isRefreshing
} from '@/integrations/supabase/client';

// Keep exporting the helper functions from the actual implementation files
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

// Continue to initialize the session during module import
import { initializeSession } from './session-helpers';

initializeSession().catch(err => {
  console.error("Error during session initialization:", err);
});
