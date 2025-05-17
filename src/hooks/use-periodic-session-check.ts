
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { UserSession } from '@/types/auth';
import { refreshSession, isRefreshing } from '@/lib/supabase';

// Define a conversion function to map Session to UserSession
const mapToUserSession = (session: any): UserSession => {
  if (!session) return null;
  
  return {
    id: session.id,
    email: session.email || session.user?.email,
    expires_at: session.expires_at, // Include expires_at in the mapping
    user_metadata: session.user_metadata || session.user?.user_metadata || {}
  };
};

/**
 * Hook to periodically check if the session is still valid
 * Helps prevent users from continuing to use the app with an invalid session
 */
export function usePeriodicSessionCheck(isAuthorized: boolean | null, currentPath: string) {
  const [isChecking, setIsChecking] = useState(false);
  const { session, setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  
  // Create a debounced redirect function to avoid multiple redirects
  const debouncedRedirect = useCallback(
    debounce((path: string) => {
      console.log(`Debounced redirect to ${path}`);
      navigate(path, { replace: true });
    }, 1000),
    [navigate]
  );

  // Function to handle session invalidation
  const handleInvalidSession = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('Session invalid or expired, redirecting to auth page');
    
    // Set session to null in auth context
    setSession(null);
    
    // Show toast notification
    toast.error('Sessão expirada', {
      description: 'Sua sessão expirou. Por favor, faça login novamente.'
    });
    
    // Create redirect URL with current path as redirect parameter
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    
    // Use debounced redirect to prevent multiple redirects
    debouncedRedirect(`/auth?${searchParams.toString()}`);
  }, [setSession, location.pathname, debouncedRedirect]);

  // Function to validate the current session
  const checkSession = useCallback(async () => {
    if (!isMountedRef.current || isChecking) return;
    
    setIsChecking(true);
    
    try {
      console.log('Periodic session check for route:', currentPath);
      
      // First check if we even have a session in context
      if (!session) {
        console.log('No session found during periodic check');
        handleInvalidSession();
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
              handleInvalidSession();
            }
          }
          return;
        }
      }
      
    } catch (error) {
      console.error('Error checking session:', error);
      
      // Only invalidate session if we're sure it's invalid
      // Check if we're getting authorization errors
      if (error.message && (
          error.message.includes('JWT expired') || 
          error.message.includes('invalid token') ||
          error.message.includes('not authorized')
        )) {
        handleInvalidSession();
      }
    } finally {
      if (isMountedRef.current) {
        setIsChecking(false);
      }
    }
  }, [session, currentPath, isChecking, handleInvalidSession]);

  useEffect(() => {
    // Skip if not authorized or already checking
    if (!isAuthorized) {
      return;
    }
    
    // Skip for auth pages
    if (currentPath.startsWith('/auth')) {
      return;
    }
    
    isMountedRef.current = true;
    
    // Initialize a session check that runs periodically
    const initializePeriodicCheck = () => {
      console.log('Setting up periodic session checks for route:', currentPath);
      
      // Check immediately on first render to ensure session hasn't expired before
      // the first interval check is triggered
      checkSession();
      
      // Clear any existing interval to prevent multiple intervals
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      // Set up periodic check - every 4 minutes
      checkIntervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          checkSession();
        }
      }, 4 * 60 * 1000); // Reduced from 5 to 4 minutes to prevent token expiry
    };
    
    // Initialize the periodic check
    initializePeriodicCheck();
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [
    isAuthorized,
    currentPath,
    checkSession
  ]);
  
  // No need to return anything as this hook is for side effects only
}
