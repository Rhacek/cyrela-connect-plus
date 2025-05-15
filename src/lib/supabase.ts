
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These environment variables are automatically injected by Lovable during build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect your project to Supabase through the Lovable integration.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
