
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These values are already set by the Lovable-Supabase integration
const supabaseUrl = "https://cbdytpkwalaoshbvxxri.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZHl0cGt3YWxhb3NoYnZ4eHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzM5MjcsImV4cCI6MjA2Mjg0OTkyN30.bXu9Bi6kSxgCnY8uD64Ez_dRash8UT6ar0J_-UP4fVI";

// Explicitly set storage key to ensure consistent storage
export const storageKey = 'sb-cbdytpkwalaoshbvxxri-auth-token';

// Token refresh lock to prevent multiple simultaneous refresh attempts
// This needs to be a module-level variable with actual state
export let isRefreshing = false;

// Exponential backoff for refresh attempts
let refreshBackoffTime = 1000; // Start with 1 second
const MAX_BACKOFF = 30000; // Max 30 seconds

// Create a single instance of the Supabase client with optimized auth settings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storageKey: storageKey,
    debug: false // Disable debug mode to reduce noise
  }
});

// Create a custom event for session state changes
export const sessionEvent = new EventTarget();
export const SESSION_UPDATED = 'SESSION_UPDATED';
export const SESSION_REMOVED = 'SESSION_REMOVED';

// Helper to emit session update events
export function emitSessionUpdate(session: any | null) {
  const event = new CustomEvent(SESSION_UPDATED, { detail: { session } });
  sessionEvent.dispatchEvent(event);
}

// Helper to emit session removal events
export function emitSessionRemoval() {
  const event = new CustomEvent(SESSION_REMOVED);
  sessionEvent.dispatchEvent(event);
}

// Centralized token refresh function with proper locking and backoff
export async function refreshSession() {
  // Use a lock to prevent multiple refresh attempts
  if (isRefreshing) {
    console.log("Token refresh already in progress, skipping");
    return null;
  }
  
  try {
    isRefreshing = true;
    console.log("Attempting to refresh token");
    
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing session:", error.message);
      
      // Handle rate limiting specifically
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        console.warn("Rate limit hit, applying exponential backoff");
        refreshBackoffTime = Math.min(refreshBackoffTime * 2, MAX_BACKOFF);
        console.log(`Next refresh attempt will wait ${refreshBackoffTime/1000} seconds`);
        return null;
      }
      
      return null;
    }
    
    if (data?.session) {
      console.log("Token refreshed successfully");
      // Reset backoff time after successful refresh
      refreshBackoffTime = 1000;
      emitSessionUpdate(data.session);
      return data.session;
    }
    
    return null;
  } catch (err) {
    console.error("Unexpected error during token refresh:", err);
    return null;
  } finally {
    // Release the lock after a delay based on backoff
    setTimeout(() => {
      isRefreshing = false;
    }, refreshBackoffTime);
  }
}
