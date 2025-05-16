
import { UserSession } from '@/types/auth';
import { supabase } from '@/lib/supabase';

// Check if a session has all required fields
export const hasRequiredSessionFields = (sessionToValidate: UserSession): boolean => {
  return !!sessionToValidate.id && !!sessionToValidate.email;
};

// Rate limiting implementation for session validation
export const isRateLimited = (lastAttemptTime: number): boolean => {
  const now = Date.now();
  // At least 1 minute between validations
  return (now - lastAttemptTime < 60000);
};

// Verify session with Supabase
export const verifySessionWithSupabase = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    const isValid = !!data.session;
    
    if (!isValid) {
      console.warn("Session validation failed: session not found in Supabase");
    }
    
    return isValid;
  } catch (err) {
    console.error("Error during Supabase session verification:", err);
    return false;
  }
};

// Main validation function that combines all checks
export const validateSession = async (
  sessionToValidate: UserSession | null,
  lastRefreshAttempt: number
): Promise<boolean> => {
  if (!sessionToValidate) return false;
  
  try {
    // Check for required session fields
    if (!hasRequiredSessionFields(sessionToValidate)) {
      console.warn("Session validation failed: missing critical fields", sessionToValidate);
      return false;
    }
    
    // Apply rate limiting
    if (isRateLimited(lastRefreshAttempt)) {
      console.log("Skipping validation check due to recent attempt");
      return true; // Assume valid to prevent excessive checks
    }
    
    // Verify session with Supabase
    return await verifySessionWithSupabase();
  } catch (err) {
    console.error("Error validating session:", err);
    return false;
  }
};
