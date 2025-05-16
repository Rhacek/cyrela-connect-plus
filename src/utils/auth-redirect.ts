
// This file provides a redirection layer to ensure we use the same Supabase client everywhere
import { supabase as mainSupabaseClient } from '@/lib/supabase';

// Re-export the main client for use by components importing from this location
export const supabase = mainSupabaseClient;

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
