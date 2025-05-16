
// This file provides a redirection layer to ensure we use the same Supabase client everywhere
import { supabase as mainSupabaseClient } from '@/lib/supabase';

// Re-export the main client for use by components importing from this location
export const supabase = mainSupabaseClient;

// Add a debugging note to identify this import being used
console.log("Auth redirect layer: Using the consolidated Supabase client");
