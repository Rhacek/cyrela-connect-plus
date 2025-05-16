
// This file provides a redirection layer to ensure we use the same Supabase client everywhere
import { supabase as mainSupabaseClient } from '@/lib/supabase';

// Re-export the main client for use by components importing from this location
export const supabase = mainSupabaseClient;

// Add a console warning for debugging
console.warn("Using the Supabase client through the redirect layer. This is expected behavior.");
