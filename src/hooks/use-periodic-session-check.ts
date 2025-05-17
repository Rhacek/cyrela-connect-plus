
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { UserSession } from '@/types/auth';

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

  useEffect(() => {
    // Skip if not authorized or already checking
    if (!isAuthorized || isChecking) {
      console.log('Not authorized, skipping periodic session checks');
      return;
    }
    
    // Skip for auth pages
    if (currentPath.startsWith('/auth')) {
      return;
    }
    
    let checkInterval: NodeJS.Timeout;
    let isMounted = true;
    
    // Initialize a session check that runs periodically
    const initializePeriodicCheck = () => {
      console.log('Setting up periodic session checks for route:', currentPath);
      
      // Check immediately on first render to ensure session hasn't expired before
      // the first interval check is triggered
      checkSession();
      
      // Set up periodic check - every 4 minutes
      checkInterval = setInterval(() => {
        if (isMounted) {
          checkSession();
        }
      }, 4 * 60 * 1000); // Reduced from 5 to 4 minutes to prevent token expiry
    };
    
    // Function to validate the current session
    const checkSession = async () => {
      if (!isMounted) return;
      
      if (isChecking) {
        console.log('Session check already in progress, skipping');
        return;
      }
      
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
        // Note: For UserSession the expires_at might be undefined, so add null check
        const expiresAt = session.expires_at ? session.expires_at * 1000 : null;
        
        if (expiresAt) {
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;
          
          if (timeUntilExpiry < 30000) { // Less than 30 seconds
            console.log('Session about to expire, handling invalidation');
            handleInvalidSession();
            return;
          }
        }
        
        // Attempt to directly verify token on admin routes to prevent 
        // issues with token refresh mechanism
        if (currentPath.startsWith('/admin')) {
          // For admin routes, ensure session is properly stored in cache
          // for future reference
          updateSessionCache(mapToUserSession(session), currentPath);
        }
        
      } catch (error) {
        console.error('Error checking session:', error);
        
        // If error during check, invalidate session to be safe
        handleInvalidSession();
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    // Optional caching mechanism for verified sessions
    const updateSessionCache = (userSession: UserSession, path: string) => {
      if (!userSession) return;
      
      // Here we could store verified paths in local storage or memory
      // For this implementation, we'll just log it
      console.log(`Session valid for path: ${path}`);
    };
    
    // Initialize the periodic check
    initializePeriodicCheck();
    
    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(checkInterval);
    };
  }, [
    isAuthorized,
    session,
    currentPath,
    isChecking,
    handleInvalidSession
  ]);
  
  // No need to return anything as this hook is for side effects only
}
