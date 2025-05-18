
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

// Initialize the session during module import
// Make sure we handle errors properly and don't block the app
import { initializeSession } from './session-helpers';

// Use a proper named function for better stack traces in error scenarios
const initializeGlobalSession = async () => {
  try {
    await initializeSession();
    console.log("Global session initialization completed");
  } catch (err) {
    console.error("Error during global session initialization:", err);
  }
};

// Call the initialization function
initializeGlobalSession();
