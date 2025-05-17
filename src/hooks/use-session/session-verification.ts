
import { refreshSession, isRefreshing } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { debounce } from '@/lib/utils';
import { useCallback } from 'react';

// Create a debounced redirect function to avoid multiple redirects
export const useSessionRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return useCallback(
    debounce((path: string) => {
      console.log(`Debounced redirect to ${path}`);
      // Only redirect if we're not already on this path
      if (location.pathname !== path) {
        navigate(path, { replace: true });
      } else {
        console.log(`Already at ${path}, skipping redirect`);
      }
    }, 1000),
    [navigate, location.pathname]
  );
};

// Handle session invalidation
export const handleInvalidSession = async (
  setSession: React.Dispatch<React.SetStateAction<any | null>>,
  currentPath: string,
  debouncedRedirect: (path: string) => void
) => {
  // Skip for client routes
  if (currentPath.startsWith('/client')) {
    return;
  }
  
  console.log('Session invalid or expired, redirecting to auth page');
  
  // Set session to null in auth context
  setSession(null);
  
  // Show toast notification
  toast.error('Sessão expirada', {
    description: 'Sua sessão expirou. Por favor, faça login novamente.'
  });
  
  // Create redirect URL with current path as redirect parameter
  const searchParams = new URLSearchParams();
  if (currentPath !== '/auth') {
    searchParams.set('redirect', currentPath);
  }
  
  // Use debounced redirect to prevent multiple redirects
  const redirectPath = searchParams.toString() ? `/auth?${searchParams.toString()}` : '/auth';
  
  // Only redirect if we're not already on the auth page
  if (currentPath !== '/auth') {
    debouncedRedirect(redirectPath);
  }
};

// Function to validate the current session
export const validateSession = async (
  session: any,
  setSession: React.Dispatch<React.SetStateAction<any | null>>,
  currentPath: string,
  debouncedRedirect: (path: string) => void
) => {
  try {
    // Skip for client routes
    if (currentPath.startsWith('/client')) {
      return;
    }
    
    // First check if we even have a session in context
    if (!session) {
      console.log('No session found during periodic check');
      handleInvalidSession(setSession, currentPath, debouncedRedirect);
      return;
    }
    
    // Check if we are less than 30 seconds from expiry
    if (session.expires_at) {
      const now = Date.now();
      const expiresAt = session.expires_at * 1000;
      const timeUntilExpiry = expiresAt - now;
      
      if (timeUntilExpiry < 30000) { // Less than 30 seconds
        console.log('Session about to expire, handling invalidation');
        
        // Try to refresh first before invalidating
        if (!isRefreshing) {
          const refreshedSession = await refreshSession();
          if (!refreshedSession) {
            handleInvalidSession(setSession, currentPath, debouncedRedirect);
          }
        }
        return;
      }
    }
  } catch (error: any) {
    console.error('Error checking session:', error);
    
    // Only invalidate session if we're sure it's invalid
    // Check if we're getting authorization errors
    if (error.message && (
        error.message.includes('JWT expired') || 
        error.message.includes('invalid token') ||
        error.message.includes('not authorized')
      )) {
      handleInvalidSession(setSession, currentPath, debouncedRedirect);
    }
  }
};
