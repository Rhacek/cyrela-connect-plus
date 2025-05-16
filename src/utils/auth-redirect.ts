
// This file provides a redirection layer to ensure we use the same Supabase client everywhere
import { supabase } from '@/lib/supabase';

// Re-export the main client for use by components importing from this location
export { supabase };

// Add a debugging note to identify this import being used
console.log("Auth redirect layer: Using the consolidated Supabase client");

// Export a helper function to verify admin access with the consolidated client
export const verifyAdminAccess = async () => {
  try {
    // Use the get session method to verify the current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error in verifyAdminAccess:", error);
      return false;
    }
    
    // Try to refresh the token to ensure it stays valid
    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Error refreshing session in verifyAdminAccess:", refreshError);
        // Continue with original session if refresh fails
      } else if (refreshData.session) {
        console.log("Session refreshed successfully in verifyAdminAccess");
        // Use the refreshed session data instead
        return refreshData.session && 
          refreshData.session.user && 
          refreshData.session.user.user_metadata?.role === 'ADMIN';
      }
    } catch (refreshErr) {
      console.error("Error refreshing session in verifyAdminAccess:", refreshErr);
      // Continue with original session if refresh fails
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
