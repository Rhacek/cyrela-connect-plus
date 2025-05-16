
import { supabase, refreshSession } from '@/lib/supabase';

// Re-export the main client for use by components importing from this location
export { supabase };

// Export a helper function to verify admin access with the consolidated client
export const verifyAdminAccess = async () => {
  try {
    // Use the get session method to verify the current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error in verifyAdminAccess:", error);
      return false;
    }
    
    if (!data.session) {
      // Try to refresh the token if no session is found
      const refreshedSession = await refreshSession();
      
      if (!refreshedSession) {
        return false;
      }
      
      // Check if the refreshed session has admin role
      return refreshedSession.user.user_metadata?.role === 'ADMIN';
    }
    
    return data.session && 
      data.session.user && 
      data.session.user.user_metadata?.role === 'ADMIN';
  } catch (error) {
    console.error("Error verifying admin access:", error);
    return false;
  }
};

// Standardized admin redirect helper
export const redirectToAdmin = (navigate: any) => {
  // Always use trailing slash for admin routes for consistency
  navigate("/admin/", { replace: true });
};
